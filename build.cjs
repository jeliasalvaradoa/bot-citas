const { buildSync } = require('esbuild');

buildSync({
  entryPoints: ['./src/app.ts'],  // Cambia esto a tu archivo de entrada
  bundle: true,
  platform: 'node',
  external: ['sharp'],
});
