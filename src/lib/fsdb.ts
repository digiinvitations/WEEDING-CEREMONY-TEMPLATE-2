import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CHUNK_SIZE = 500000;
const memoryCache = new Map<string, string>();

// Simple IndexedDB wrapper for persistent caching & local storage
function getIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FSDB_Cache", 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromIDB(key: string): Promise<string | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readonly");
      const store = tx.objectStore("files");
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return null;
  }
}

async function saveToIDB(key: string, value: string): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    // Ignore
  }
}

export function transformGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Handle drive.google.com/file/d/ID/view format
  const match1 = url.match(/\/file\/d\/([^/]+)/);
  if (match1 && match1[1]) {
    return `https://drive.google.com/uc?export=download&id=${match1[1]}`;
  }
  
  // Handle drive.google.com/open?id=ID format
  const match2 = url.match(/id=([^&]+)/);
  if (url.includes('drive.google.com') && match2 && match2[1]) {
    return `https://drive.google.com/uc?export=download&id=${match2[1]}`;
  }
  
  return url;
}

export async function uploadToFsdb(base64: string): Promise<string> {
  const fileId = `fsdb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const fileUrl = `fsdb://${fileId}`;
  
  try {
    await saveToIDB(fileUrl, base64);
    memoryCache.set(fileUrl, base64);
  } catch (err) {
    console.warn("Local storage to IndexedDB failed:", err);
  }
  
  // 1. Save to local Express backend server for permanent disk backup
  try {
    console.log(`[uploadToFsdb] Syncing file ${fileId} to local Express backend...`);
    await fetch("/api/fsdb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: fileId, base64: base64 })
    });
    console.log(`[uploadToFsdb] Successfully synced file to Express backend.`);
  } catch (backendErr) {
    console.warn("[uploadToFsdb] Failed to sync file to Express backend:", backendErr);
  }
  
  // 2. Save to Firestore in chunks
  try {
    const totalChunks = Math.ceil(base64.length / CHUNK_SIZE);
    const createdAt = new Date().toISOString();
    
    // Save each chunk
    for (let i = 0; i < totalChunks; i++) {
      const chunkData = base64.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await setDoc(doc(db, "fsFiles", `${fileId}_chunk_${i}`), {
        fileId: fileId,
        index: i,
        data: chunkData,
        totalChunks: totalChunks,
        createdAt: createdAt
      });
    }
  } catch (err) {
    console.warn("Failed to upload chunks to Firestore:", err);
  }
  
  return fileUrl;
}

export async function fetchFromFsdb(fileUrl: string): Promise<string> {
  if (!fileUrl) return fileUrl;
  if (!fileUrl.startsWith("fsdb://")) return transformGoogleDriveUrl(fileUrl);
  
  if (memoryCache.has(fileUrl)) {
    return memoryCache.get(fileUrl)!;
  }
  
  const idbCache = await getFromIDB(fileUrl);
  if (idbCache) {
    memoryCache.set(fileUrl, idbCache);
    return idbCache;
  }
  
  const fileId = fileUrl.replace("fsdb://", "");

  // 1. FIRST, try to fetch from local Express backend disk backup (lightning fast + survives clears)
  try {
    console.log(`[fetchFromFsdb] Attempting to fetch file ${fileId} from local Express backend...`);
    const res = await fetch(`/api/fsdb/${fileId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.base64) {
        console.log(`[fetchFromFsdb] Successfully retrieved file from local Express backend.`);
        await saveToIDB(fileUrl, data.base64);
        memoryCache.set(fileUrl, data.base64);
        return data.base64;
      }
    }
  } catch (backendErr) {
    console.warn(`[fetchFromFsdb] Failed to fetch file from Express backend:`, backendErr);
  }
  
  // 2. SECOND, try to fetch from Cloud Firestore with a 1.5s timeout race
  try {
    console.log(`[fetchFromFsdb] Falling back to fetch file ${fileId} from Cloud Firestore...`);
    
    const fetchDocPromise = getDoc(doc(db, "fsFiles", `${fileId}_chunk_0`));
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error("Firestore timeout (1.5s)")), 1500)
    );
    
    const chunk0Doc = (await Promise.race([fetchDocPromise, timeoutPromise])) as any;
    
    if (chunk0Doc && chunk0Doc.exists()) {
      const totalChunks = chunk0Doc.data().totalChunks;
      let fullBase64 = chunk0Doc.data().data;
      
      for (let i = 1; i < totalChunks; i++) {
        const chunkDocPromise = getDoc(doc(db, "fsFiles", `${fileId}_chunk_${i}`));
        const chunkDoc = (await Promise.race([chunkDocPromise, timeoutPromise])) as any;
        
        if (chunkDoc && chunkDoc.exists()) {
          fullBase64 += chunkDoc.data().data;
        } else {
          console.warn(`Chunk ${i} missing or timed out for ${fileId}`);
          return "";
        }
      }
      
      if (fullBase64) {
        await saveToIDB(fileUrl, fullBase64);
        memoryCache.set(fileUrl, fullBase64);
        
        // Asynchronously backup to local Express backend so we have it next time
        try {
          fetch("/api/fsdb", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId: fileId, base64: fullBase64 })
          });
        } catch (syncErr) {
          // Ignore background sync errors
        }
        
        return fullBase64;
      }
    }
  } catch (err) {
    console.warn(`[fetchFromFsdb] Firestore fetch failed or timed out for ${fileId}:`, err);
  }
  
  return "";
}
