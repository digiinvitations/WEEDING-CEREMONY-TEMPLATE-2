const fs = require('fs');

let adminTsx = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const searchStr = `                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Google Maps Embed URL</label>`;

const replacement = `                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Event Thumbnail (Image Upload)</label>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    try {
                                      const url = await handleImageUpload(e.target.files[0]);
                                      setEditConfig(p => {
                                        const newEvents = [...p.weddingEvents];
                                        newEvents[i].thumbnailUrl = url;
                                        return { ...p, weddingEvents: newEvents };
                                      });
                                    } catch(err) {
                                      console.error(err);
                                      alert("Image upload failed");
                                    }
                                  }
                                }} 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-400 mb-2" 
                              />
                              {ev.thumbnailUrl && (
                                <FirestoreImage disableFallback src={ev.thumbnailUrl} alt="Preview" className="h-16 object-contain border border-pink-200 rounded" />
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Google Maps Embed URL</label>`;

adminTsx = adminTsx.replace(searchStr, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', adminTsx);
