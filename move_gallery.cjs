const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const galleryStart = `        {/* 10. PHOTO GALLERY SECTION (STICKY STACKING) */}`;
const galleryEndStr = `          </section>
        )}

        <SectionSeparator />`;

const startIndex = appTsx.indexOf(galleryStart);
const endIndex = appTsx.indexOf(galleryEndStr, startIndex) + galleryEndStr.length;

if (startIndex === -1 || endIndex < startIndex) {
  console.log("Could not find gallery section");
  process.exit(1);
}

const gallerySection = appTsx.substring(startIndex, endIndex);
appTsx = appTsx.slice(0, startIndex) + appTsx.slice(endIndex);

const groomBrideEnd = `        </motion.section>

        <SectionSeparator />`;
const brideIndex = appTsx.indexOf(groomBrideEnd, startIndex); // Start searching after where gallery was

if (brideIndex === -1) {
    console.log("Could not find groom bride end");
    process.exit(1);
}

const insertionPoint = brideIndex + groomBrideEnd.length;

appTsx = appTsx.slice(0, insertionPoint) + '\n\n' + gallerySection + appTsx.slice(insertionPoint);

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Moved successfully.");
