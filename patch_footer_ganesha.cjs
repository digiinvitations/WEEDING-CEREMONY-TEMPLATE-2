const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const footerStart = `<footer className="py-10 bg-white text-center relative z-10 flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-pink-50/50 pointer-events-none" />`;

const footerReplacement = `<footer className="py-10 bg-white text-center relative z-10 flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-pink-50/50 pointer-events-none" />

          {/* Footer Ganesha Icon */}
          <div className="relative z-10 mb-6 flex justify-center w-16 h-16">
            {config.heroSettings?.ganeshaIconUrl ? (
              <FirestoreImage disableFallback fallbackNode={<GaneshaIcon className="w-full h-full text-amber-600/70" />} src={config.heroSettings.ganeshaIconUrl} alt="Footer Ganesha" className="w-full h-full object-contain opacity-80" />
            ) : (
              <GaneshaIcon className="w-full h-full text-amber-600/70" />
            )}
          </div>
`;

appTsx = appTsx.replace(footerStart, footerReplacement);
fs.writeFileSync('src/App.tsx', appTsx);
console.log("Added ganesha to footer");
