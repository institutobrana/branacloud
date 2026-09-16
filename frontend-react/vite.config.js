import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const configDir = path.dirname(fileURLToPath(import.meta.url));
  const env = loadEnv(mode, configDir, '');
  const localHttpsDir = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, 'BranaCloude', 'https')
    : null;
  const httpsKey = env.BRANA_DEV_HTTPS_KEY || (localHttpsDir && path.join(localHttpsDir, 'localhost-lan-key.pem'));
  const httpsCert = env.BRANA_DEV_HTTPS_CERT || (localHttpsDir && path.join(localHttpsDir, 'localhost-lan.pem'));
  const https = httpsKey && httpsCert && fs.existsSync(httpsKey) && fs.existsSync(httpsCert)
    ? { key: fs.readFileSync(httpsKey), cert: fs.readFileSync(httpsCert) }
    : undefined;

  return {
  base: '/app/',
  plugins: [react()],
  resolve: {
    dedupe: ['dayjs'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    https,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  };
});
