import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
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

const SITE_URL = 'https://heathernew.com';

// Structured data for name searches: tells search engines this site is one
// person and which profiles are hers. Added to the homepage and About only.
const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#heather`,
      name: 'Heather New',
      url: `${SITE_URL}/`,
      jobTitle: 'Creative Technologist',
      description:
        'Creative technologist in Chicago building interactive experiences at the intersection of design, code, and physical technology.',
      image: `${SITE_URL}/assets/heathernew-og.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chicago',
        addressRegion: 'IL',
        addressCountry: 'US',
      },
      sameAs: ['https://linkedin.com/in/heathernew09', 'https://github.com/heathernew09'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Heather New',
      author: { '@id': `${SITE_URL}/#heather` },
    },
  ],
};
const SCHEMA_PAGES = ['/index.html', '/pages/about.html'];

// sitemap.xml is written from the same page list the build uses, so a new
// page appears in it automatically. Pages marked noindex are left out, and
// each date is the page's last git commit.
function buildSitemap() {
  const files = ['index.html', ...Object.keys(pages).map((name) => `${name}.html`)];
  const urls = files
    .filter(
      (file) => !/<meta\s+name="robots"\s+content="[^"]*noindex/.test(fs.readFileSync(file, 'utf8'))
    )
    .sort()
    .map((file) => {
      const loc = file === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${file}`;
      let lastmod = '';
      try {
        const date = execSync(`git log -1 --format=%cs -- "${file}"`, { encoding: 'utf8' }).trim();
        if (date) lastmod = `<lastmod>${date}</lastmod>`;
      } catch {
        // Not a git checkout: ship the sitemap without dates.
      }
      return `  <url><loc>${loc}</loc>${lastmod}</url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

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
      handler(_html: string, ctx: { path: string }) {
        const notice = {
          tag: 'script',
          attrs: { type: 'module', src: '/src/js/cookie-notice.js' },
          injectTo: 'body' as const,
        };
        // The Google tag only ships in the built site, so local dev sends no hits.
        if (!isBuild) return [notice];
        const schema = SCHEMA_PAGES.includes(ctx.path)
          ? [
              {
                tag: 'script',
                attrs: { type: 'application/ld+json' },
                children: JSON.stringify(PERSON_SCHEMA),
                injectTo: 'head' as const,
              },
            ]
          : [];
        return [
          ...schema,
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
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap() });
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
