import { defineConfig } from 'vite';
import path from 'path';
import injectHTML from 'vite-plugin-html-inject';
import { globSync } from 'glob';

// Get all HTML files in pages and its subdirectories
const pages = globSync('pages/**/*.html').reduce((acc, file) => {
  // Create a relative path from root to the file
  const relativePath = path.relative('.', file);
  // Skip index.html and 404.html as they are handled or not needed in pages
  if (relativePath === 'index.html' || relativePath === '404.html') return acc;

  // Use the relative path as the key (e.g., 'pages/about')
  const name = relativePath.replace(/\.html$/, '');
  acc[name] = path.resolve(__dirname, file);
  return acc;
}, {});

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
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
