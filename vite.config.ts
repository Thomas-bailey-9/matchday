import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// Writes sw.js into the build with the exact list of built files, so the
// whole app is cached on first visit and works offline afterwards.
function serviceWorker(): Plugin {
  return {
    name: 'matchday-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      // Older .woff fonts are skipped: every browser that installs a service worker reads .woff2.
      const files = Object.keys(bundle).filter((f) => !f.endsWith('.map') && !f.endsWith('.woff'));
      const extra = ['./', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
      const version = Date.now().toString(36);
      const source = readFileSync('sw/sw.js', 'utf8')
        .replace('__VERSION__', version)
        .replace('__PRECACHE__', JSON.stringify([...extra, ...files]));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  // Published as a GitHub Pages project site at /matchday/.
  base: '/matchday/',
  plugins: [react(), serviceWorker()],
});
