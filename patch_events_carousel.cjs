const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const eventsStart = `        {/* WEDDING EVENTS SECTION */}`;
const eventsEndStr = `        </section>

        <SectionSeparator />`;

const startIndex = appTsx.indexOf(eventsStart);
const endIndex = appTsx.indexOf(eventsEndStr, startIndex) + eventsEndStr.length;

if (startIndex === -1 || endIndex < startIndex) {
  console.log("Could not find events section");
  process.exit(1);
}

const carouselStateAndRef = `
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!carouselRef.current || isHovering) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: clientWidth > 600 ? 400 : 300, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -(carouselRef.current.clientWidth > 600 ? 400 : 300), behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth > 600 ? 400 : 300, behavior: 'smooth' });
    }
  };
`;

// Insert the hooks right before the return statement of App
appTsx = appTsx.replace('return (', carouselStateAndRef + '\n  return (');

// We also need ChevronLeft and ChevronRight from lucide-react. Let's check if they are imported.
if (!appTsx.includes('ChevronLeft')) {
  appTsx = appTsx.replace('ChevronUp,', 'ChevronUp, ChevronLeft, ChevronRight,');
}

const newEventsSection = `        {/* WEDDING EVENTS SECTION */}
        <section id="wedding-events" className="py-16 px-4 md:px-8 max-w-7xl mx-auto relative z-10 overflow-hidden">
          <div className="text-center mb-12">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-700 font-bold">
              Join The Celebration
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-red-700 tracking-wide mt-1 uppercase font-bold">
              Wedding Events
            </h2>
            <div className="w-12 h-0.5 bg-gold-600/40 mx-auto mt-3" />
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
          >
            {/* Navigation Buttons */}
            <button 
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gold-300 text-gold-700 hover:bg-gold-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gold-300 text-gold-700 hover:bg-gold-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-6 md:gap-8 pb-8 pt-4 px-4 snap-x snap-mandatory no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {config.weddingEvents.map((event, index) => (
                <div
                  key={index}
                  className="min-w-[85vw] md:min-w-[400px] max-w-[450px] snap-center flex flex-col bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-gold-300/30 shadow-xl"
                >
                  {/* Thumbnail Container: Preserves original aspect ratio using object-contain */}
                  {event.thumbnailUrl && (
                    <div className="w-full bg-black/5 rounded-2xl overflow-hidden shadow-inner mb-6 flex items-center justify-center" style={{ minHeight: '200px' }}>
                      <FirestoreImage 
                        src={event.thumbnailUrl} 
                        alt={event.eventName} 
                        className="w-full max-h-[300px] object-contain" 
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center gap-4 flex-grow">
                    <div>
                      <h3 className="font-display text-2xl text-red-700 font-bold mb-2">
                        {event.eventName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-800 justify-center">
                        <Clock className="w-4 h-4 text-gold-600" />
                        <span className="font-sans font-medium">{event.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center flex-grow">
                      <p className="font-semibold text-gold-900">{event.venueName}</p>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed font-medium">{event.venueAddress}</p>
                    </div>

                    <a
                      href={event.mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wider hover:shadow-xl transition-all w-fit mt-auto group"
                    >
                      <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionSeparator />`;

appTsx = appTsx.slice(0, startIndex) + newEventsSection + appTsx.slice(endIndex);

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Carousel implemented successfully.");
