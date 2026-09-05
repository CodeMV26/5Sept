import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/football-data': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/football-data/, ''),
        headers: {
          'X-Auth-Token': 'e0ca06c07c634d4fb0950365bd82ffd0',
        },
      },
    },
  },
});