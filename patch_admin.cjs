const fs = require('fs');

let adminTsx = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const eventsStart = `                  {activeTab === "events" && (`;
const eventsEndStr = `                    </motion.div>
                  )}`;

const startIndex = adminTsx.indexOf(eventsStart);
const endIndex = adminTsx.indexOf(eventsEndStr, startIndex) + eventsEndStr.length;

if (startIndex === -1 || endIndex < startIndex) {
  console.log("Could not find events tab section");
  process.exit(1);
}

const newEventsSection = `                  {activeTab === "events" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
                      <div className="bg-pink-50/30 p-4 rounded-2xl border border-pink-300/10 space-y-4">
                        <div className="flex justify-between items-center border-b border-pink-300/20 pb-2">
                          <h4 className="font-display text-pink-900 text-lg">Wedding Event Details</h4>
                          <button 
                            className="bg-gold-500 text-white px-3 py-1 rounded text-xs"
                            onClick={() => setEditConfig(p => ({
                              ...p, 
                              weddingEvents: [...(p.weddingEvents || []), {
                                eventName: "New Event",
                                venueName: "",
                                venueAddress: "",
                                time: "",
                                mapEmbedUrl: "",
                                mapDirectionsUrl: ""
                              }]
                            }))}
                          >
                            Add Event
                          </button>
                        </div>
                        
                        {(editConfig.weddingEvents || []).map((ev, i) => (
                          <div key={i} className="border border-pink-200 p-4 rounded-lg space-y-4 mb-4 bg-white/50 relative">
                            <button 
                              className="absolute top-2 right-2 text-red-500 font-bold"
                              onClick={() => setEditConfig(p => {
                                const newEvents = [...p.weddingEvents];
                                newEvents.splice(i, 1);
                                return { ...p, weddingEvents: newEvents };
                              })}
                            >
                              ✕
                            </button>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Event Name</label>
                              <input 
                                type="text" 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 text-pink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                                value={ev.eventName || ""}
                                onChange={(e) => setEditConfig(p => {
                                  const newEvents = [...p.weddingEvents];
                                  newEvents[i].eventName = e.target.value;
                                  return { ...p, weddingEvents: newEvents };
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Venue Name</label>
                              <input 
                                type="text" 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 text-pink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                                value={ev.venueName || ""}
                                onChange={(e) => setEditConfig(p => {
                                  const newEvents = [...p.weddingEvents];
                                  newEvents[i].venueName = e.target.value;
                                  return { ...p, weddingEvents: newEvents };
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Venue Address</label>
                              <input 
                                type="text" 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 text-pink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                                value={ev.venueAddress || ""}
                                onChange={(e) => setEditConfig(p => {
                                  const newEvents = [...p.weddingEvents];
                                  newEvents[i].venueAddress = e.target.value;
                                  return { ...p, weddingEvents: newEvents };
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Event Time</label>
                              <input 
                                type="text" 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 text-pink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                                value={ev.time || ""}
                                onChange={(e) => setEditConfig(p => {
                                  const newEvents = [...p.weddingEvents];
                                  newEvents[i].time = e.target.value;
                                  return { ...p, weddingEvents: newEvents };
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Google Maps Embed URL</label>
                              <input 
                                type="text" 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 text-pink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                                value={ev.mapEmbedUrl || ""}
                                onChange={(e) => setEditConfig(p => {
                                  const newEvents = [...p.weddingEvents];
                                  newEvents[i].mapEmbedUrl = e.target.value;
                                  return { ...p, weddingEvents: newEvents };
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-pink-800 uppercase tracking-wider mb-1.5 ml-1">Google Maps Directions Link</label>
                              <input 
                                type="text" 
                                className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 text-pink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                                value={ev.mapDirectionsUrl || ""}
                                onChange={(e) => setEditConfig(p => {
                                  const newEvents = [...p.weddingEvents];
                                  newEvents[i].mapDirectionsUrl = e.target.value;
                                  return { ...p, weddingEvents: newEvents };
                                })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button onClick={saveChanges} className="w-full bg-gold-gradient text-white font-bold uppercase text-sm tracking-wider py-3 rounded-xl cursor-pointer">
                        Save Changes
                      </button>
                    </motion.div>
                  )}`;

adminTsx = adminTsx.slice(0, startIndex) + newEventsSection + adminTsx.slice(endIndex);

fs.writeFileSync('src/components/AdminPanel.tsx', adminTsx);
console.log("Patched admin panel events tab");
