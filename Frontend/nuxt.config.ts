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
  ],

  imports: {
    dirs: ['data/**', 'store/**']
  },

  icon: {
    serverBundle: {
      collections: ['lucide']
    }
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  runtimeConfig: {
    public: {
      apiBase: ''
    }
  },
})