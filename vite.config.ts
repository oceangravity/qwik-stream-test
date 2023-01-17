import path from 'path'
import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig(() => {
  return {
    plugins: [dynamicImport(), qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.join(__dirname, 'src') },
        { find: /^src\//, replacement: path.join(__dirname, 'src/') },
        { find: '/root/src', replacement: path.join(__dirname, 'src') },
      ],
    },
  };
});
