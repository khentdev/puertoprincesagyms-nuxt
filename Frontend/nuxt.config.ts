import tailwindcss from "@tailwindcss/vite";
import getDynamicRoutes from "./app/utils/getDynamicRoutes";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  site: {
    url: process.env.NUXT_SITE_URL ?? 'http://localhost:3000',
    name: 'Puerto Princesa Gyms',
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  

  experimental: {
    payloadExtraction: false,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: getDynamicRoutes()
    },
  },

  sitemap: {
    urls: getDynamicRoutes()
  },

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

  icon: {
    serverBundle: {
      collections: ['lucide', 'prime']
    },
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["google.maps"]
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      googleMapsMapId: process.env.NUXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
      siteUrl: process.env.NUXT_SITE_URL,
    }
  },
})