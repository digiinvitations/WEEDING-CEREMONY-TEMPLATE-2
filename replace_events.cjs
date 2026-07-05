const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const eventsStart = `        {/* ENGAGEMENT DETAILS SECTION */}`;
const eventsEndStr = `        </motion.section>

        <SectionSeparator />`;

const startIndex = appTsx.indexOf(eventsStart);
const endIndex = appTsx.indexOf(eventsEndStr, startIndex) + eventsEndStr.length;

if (startIndex === -1 || endIndex < startIndex) {
  console.log("Could not find events section");
  process.exit(1);
}

const newEventsSection = `        {/* WEDDING EVENTS SECTION */}
        <section id="wedding-events" className="py-16 px-4 md:px-8 max-w-5xl mx-auto relative z-10 overflow-hidden">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-700 font-bold">
              Join The Celebration
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-red-700 tracking-wide mt-1 uppercase font-bold">
              Wedding Events
            </h2>
            <div className="w-12 h-0.5 bg-gold-600/40 mx-auto mt-3" />
          </div>

          <div className="space-y-12">
            {config.weddingEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={\`flex flex-col md:flex-row \${isEven ? '' : 'md:flex-row-reverse'} items-center gap-8 bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gold-300/30 shadow-xl\`}
                >
                  <div className="w-full md:w-1/2 flex justify-center">
                     <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-lg border border-gold-400/30">
                        {event.mapEmbedUrl ? (
                          <iframe
                            src={event.mapEmbedUrl}
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        ) : (
                          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-pink-300" />
                          </div>
                        )}
                     </div>
                  </div>

                  <div className={\`w-full md:w-1/2 flex flex-col \${isEven ? 'md:items-start text-center md:text-left' : 'md:items-end text-center md:text-right'} gap-4\`}>
                    <div>
                      <h3 className="font-display text-2xl text-red-700 font-bold mb-2">
                        {event.eventName}
                      </h3>
                      <div className={\`flex items-center gap-2 text-gray-800 justify-center \${isEven ? 'md:justify-start' : 'md:justify-end'}\`}>
                        <Clock className="w-4 h-4 text-gold-600" />
                        <span className="font-sans font-medium">{event.time}</span>
                      </div>
                    </div>

                    <div className={\`flex flex-col items-center \${isEven ? 'md:items-start' : 'md:items-end'}\`}>
                      <p className="font-semibold text-gold-900">{event.venueName}</p>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed font-medium">{event.venueAddress}</p>
                    </div>

                    <a
                      href={event.mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wider hover:shadow-xl transition-all w-fit mt-2 group"
                    >
                      <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Get Directions
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <SectionSeparator />`;

appTsx = appTsx.slice(0, startIndex) + newEventsSection + appTsx.slice(endIndex);

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Replaced successfully.");
