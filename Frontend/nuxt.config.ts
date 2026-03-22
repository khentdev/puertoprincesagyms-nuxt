import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    '@peterbud/nuxt-query',
  ],

  nuxtQuery: {
    autoImports: true,
    queryClientOptions: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        }
      }
    }
  },

  imports: {
    dirs: ['api/**', 'errors/**']
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