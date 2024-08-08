import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";`
      }
    }
  },
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  },
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
      } else {
        return { relative: true }
      }
    }
  },
  // Add this section for favicon configuration
  template: {
    favicon: {
      defaults: {
        ico: 'src/assets/favicon.ico',
        png: 'src/assets/favicon.png',
        svg: 'src/assets/favicon.svg',
        appleTouchIcon: 'src/assets/apple-touch-icon.png'
      },
      sizes: [16, 32, 64, 192, 512],
      output: 'public'
    }
  }
})
