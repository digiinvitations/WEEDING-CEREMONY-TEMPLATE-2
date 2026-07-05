const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = appTsx.indexOf('{/* 7. WEDDING TEASER VIDEO SECTION */}');
const endIndex = appTsx.indexOf('{/* WEDDING EVENTS SECTION */}');

const goodVideoSection = `{/* 7. WEDDING TEASER VIDEO SECTION */}
        {config.youtubeEmbedUrl && (
          <motion.section 
             id="video" 
             initial={{ opacity: 0, y: 30 }} 
             whileInView={{ opacity: 1, y: 0 }} 
             viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="py-16 bg-white/60 border-y border-gold-500/20 relative z-10 shadow-sm"
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-700 font-bold block mb-2">
                Special Moments
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-red-700 tracking-wide mb-8 uppercase font-bold">
                Wedding Teaser
              </h2>
              <div className="w-12 h-0.5 bg-gold-600/40 mx-auto mb-8" />
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border-4 border-white aspect-video bg-black/5">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={config.youtubeEmbedUrl}
                  title="Wedding Teaser Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 'none' }}
                ></iframe>
              </div>
            </div>
          </motion.section>
        )}
        <SectionSeparator />
        `;

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  appTsx = appTsx.slice(0, startIndex) + goodVideoSection + appTsx.slice(endIndex);
  fs.writeFileSync('src/App.tsx', appTsx);
  console.log("Replaced video section exactly!");
} else {
  console.log("Could not find start or end index.");
}
