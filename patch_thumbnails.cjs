const fs = require('fs');

let configTs = fs.readFileSync('src/weddingConfig.ts', 'utf8');

configTs = configTs.replace(
  'eventName: "Haldi & Mehndi",',
  'eventName: "Haldi & Mehndi",\n      thumbnailUrl: "https://images.unsplash.com/photo-1595015383921-2e230ce7103e?auto=format&fit=crop&w=800",'
);
configTs = configTs.replace(
  'eventName: "Sangeet Ceremony",',
  'eventName: "Sangeet Ceremony",\n      thumbnailUrl: "https://images.unsplash.com/photo-1623083652877-628f804564b7?auto=format&fit=crop&w=800",'
);
configTs = configTs.replace(
  'eventName: "Wedding Ceremony",',
  'eventName: "Wedding Ceremony",\n      thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800",'
);
configTs = configTs.replace(
  'eventName: "Reception",',
  'eventName: "Reception",\n      thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800",'
);

fs.writeFileSync('src/weddingConfig.ts', configTs);
