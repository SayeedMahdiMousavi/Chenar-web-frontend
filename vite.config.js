import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#21c0ad',
          '@text-color': '#727272',
          '@font-family': 'KALAMEH',
          '@border-radius-base': '7px',
          '@btn-border-radius-base': '7px',
          '@checkbox-border-radius': '4px',
          hack: `true; @import (reference) "${path.resolve('src/less/main.less')}";`,
        },
      },
    },
  },
  optimizeDeps: {
    include: ['antd'],
  },
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
