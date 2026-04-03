import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
  ],

  imports: {
    dirs: ['data/**', 'store/**', 'config/**']
  },

  ogImage: {
    enabled: false,
  },

  icon: {
    serverBundle: {
      collections: ['lucide', 'prime']
    },
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      googleMapsMapId: process.env.NUXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
    }
  },
})