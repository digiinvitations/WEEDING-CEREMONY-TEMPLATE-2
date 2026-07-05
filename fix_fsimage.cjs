const fs = require('fs');

let fsImage = fs.readFileSync('src/components/FirestoreImage.tsx', 'utf8');

const patch = `
export function FirestoreImage(props: React.ComponentProps<"img"> & { disableFallback?: boolean; fallbackNode?: React.ReactNode }) {
  const { src, disableFallback, fallbackNode, ...rest } = props;
`;

fsImage = fsImage.replace(/export function FirestoreImage\(props: React\.ComponentProps\<"img"\> \& \{ disableFallback\?: boolean \}\) \{\n  const \{ src, disableFallback, \.\.\.rest \} = props;/, patch);

fsImage = fsImage.replace(
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
  }`,
  `  if (error || !resolvedSrc) {
    if (disableFallback) {
        return fallbackNode ? <>{fallbackNode}</> : null;
    }
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
