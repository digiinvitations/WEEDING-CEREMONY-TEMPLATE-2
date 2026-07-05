const fs = require('fs');

let fsImage = fs.readFileSync('src/components/FirestoreImage.tsx', 'utf8');

// If we pass disableFallback=true, don't fallback to universalFallback, just don't render or render the alt
const patch = `
export function FirestoreImage(props: React.ComponentProps<"img"> & { disableFallback?: boolean }) {
  const { src, disableFallback, ...rest } = props;
`;

fsImage = fsImage.replace(/export function FirestoreImage\(props: React\.ComponentProps\<"img"\>\) \{\n  const \{ src, \.\.\.rest \} = props;/, patch);

fsImage = fsImage.replace(
  `  if (error || !resolvedSrc) {
    return (
      <img 
        src={universalFallback} 
        {...rest} 
        className={props.className}
        style={props.style}
      />
    );
  }`,
  `  if (error || !resolvedSrc) {
    if (disableFallback) return null;
    return (
      <img 
        src={universalFallback} 
        {...rest} 
        className={props.className}
        style={props.style}
      />
    );
  }`
);

fs.writeFileSync('src/components/FirestoreImage.tsx', fsImage);
