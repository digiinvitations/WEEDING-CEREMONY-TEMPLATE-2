const fs = require('fs');
let fsImage = fs.readFileSync('src/components/FirestoreImage.tsx', 'utf8');

fsImage = fsImage.replace(
  `      onError={() => {
        setResolvedSrc(universalFallback);
      }} `,
  `      onError={() => {
        if (disableFallback) {
          setError(true);
        } else {
          setResolvedSrc(universalFallback);
        }
      }} `
);

fs.writeFileSync('src/components/FirestoreImage.tsx', fsImage);
