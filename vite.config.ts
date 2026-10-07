import { defineConfig } from 'vite';
import path from 'path';
import injectHTML from 'vite-plugin-html-inject';
import { globSync } from 'glob';

// Get all HTML files in pages and its subdirectories
// Drafts and scaffolds that live in pages/ but must never ship. .gitignore keeps
// them out of the repo; this keeps them out of dist/, which is a separate thing.
const NO_SHIP = [/-pre-bauhaus\.html$/, /^pages\/template\.html$/];

const pages = globSync('pages/**/*.html').reduce((acc, file) => {
  // Create a relative path from root to the file
  const relativePath = path.relative('.', file);
  // Skip index.html and 404.html as they are handled or not needed in pages
  if (relativePath === 'index.html' || relativePath === '404.html') return acc;
  if (NO_SHIP.some((re) => re.test(relativePath))) return acc;

  // Use the relative path as the key (e.g., 'pages/about')
  const name = relativePath.replace(/\.html$/, '');
  acc[name] = path.resolve(__dirname, file);
  return acc;
}, {});

// Google Analytics + the cookie notice, added to every page from one place.
// Each page carries its own <head>, so doing this by hand means 29 edits and
// every new page forgetting it.
const GA_ID = 'G-C81YQBFXYN';

// Where consent is legally required before analytics cookies: EEA, UK, Switzerland.
const CONSENT_REGIONS = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
];

// Consent defaults have to be set before 'config'. Analytics is on by default,
// off by default in CONSENT_REGIONS, and a visitor's saved choice from the
// cookie notice (src/js/cookie-notice.js) overrides either. Ads stay off.
const GA_SNIPPET = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  gtag('consent', 'default', { analytics_storage: 'denied', region: ${JSON.stringify(CONSENT_REGIONS)} });
  try {
    var c = localStorage.getItem('hn-cookie-choice');
    if (c === 'granted' || c === 'denied') gtag('consent', 'update', { analytics_storage: c });
  } catch (e) {}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
`;

function siteWideHead() {
  let isBuild = false;
  return {
    name: 'site-wide-head',
    config(_config, { command }) {
      isBuild = command === 'build';
    },
    transformIndexHtml: {
      // 'pre' so Vite still bundles the injected module script.
      order: 'pre' as const,
      handler() {
        const notice = {
          tag: 'script',
          attrs: { type: 'module', src: '/src/js/cookie-notice.js' },
          injectTo: 'body' as const,
        };
        // The Google tag only ships in the built site, so local dev sends no hits.
        if (!isBuild) return [notice];
        return [
          {
            tag: 'script',
            attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` },
            injectTo: 'head-prepend' as const,
          },
          { tag: 'script', children: GA_SNIPPET, injectTo: 'head-prepend' as const },
          notice,
        ];
      },
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    siteWideHead(),
    injectHTML({
      tagName: 'load',
      sourceAttr: 'src',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notfound: path.resolve(__dirname, '404.html'),
        ...pages,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@partials': path.resolve(__dirname, './src/partials'),
      '@css': path.resolve(__dirname, './src/css'),
      '@js': path.resolve(__dirname, './src/js'),
    },
  },
  server: {
    port: 8888,
  },
  preview: {
    port: 8888,
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
