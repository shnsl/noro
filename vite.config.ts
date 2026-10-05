import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/noro/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon-32.png',
        'favicon-48.png',
        'apple-touch-icon.png',
        'neuro-icon.png',
        'pwa-192.png',
        'pwa-512.png',
        'pwa-192-maskable.png',
        'pwa-512-maskable.png',
      ],
      manifest: {
        name: 'NEURO',
        short_name: 'NEURO',
        description: 'Nörolojik rehabilitasyon için hasta ve seans planı',
        lang: 'tr',
        start_url: '/noro/',
        scope: '/noro/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFFFFF',
        theme_color: '#1E4D8C',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,webmanifest}'],
        navigateFallback: '/noro/index.html',
      },
    }),
  ],
})
