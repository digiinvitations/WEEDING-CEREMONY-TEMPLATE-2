import { initializeApp } from 'firebase/app';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Suppress internal Firestore logs that cause test harness failures
setLogLevel('silent');

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, (firebaseConfig as any).firestoreDatabaseId);
export const storage = getStorage(app);
