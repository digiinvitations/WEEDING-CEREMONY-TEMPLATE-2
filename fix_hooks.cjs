const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const hookStart = `  const carouselRef = useRef<HTMLDivElement>(null);`;
const hookEnd = `  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth > 600 ? 400 : 300, behavior: 'smooth' });
    }
  };`;

const startIndex = appTsx.indexOf(hookStart);
const endIndex = appTsx.indexOf(hookEnd) + hookEnd.length;

const extractedHooks = appTsx.substring(startIndex, endIndex);

appTsx = appTsx.slice(0, startIndex) + appTsx.slice(endIndex);

// Find the actual return (
// It's the one that has <div className="min-h-[100dvh]...
const realReturnIndex = appTsx.indexOf('  return (\n    <div className="min-h-[100dvh]');

if (realReturnIndex !== -1) {
  appTsx = appTsx.slice(0, realReturnIndex) + extractedHooks + '\n' + appTsx.slice(realReturnIndex);
  fs.writeFileSync('src/App.tsx', appTsx);
  console.log("Hooks moved successfully.");
} else {
  console.log("Could not find real return");
}
