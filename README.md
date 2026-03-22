# Puerto Princesa Gym Directory

A centralized directory to help locals and visitors quickly find gyms across Puerto Princesa City, organized by barangay with direct Google Maps integration.

---

## Project Overview

Finding gyms in Puerto Princesa is currently fragmented across social media, word of mouth, and incomplete listings. This project solves that by providing a single, clean directory with accurate location data and easy navigation.

> **Note:** This is a migration of the original [Vue SPA](https://github.com/khentdev/puertoprincesagyms)

### Target Audience
- **Local residents** searching for nearby gym options
- **Visitors and newcomers** exploring fitness facilities in Puerto Princesa

---

## Features

- **Barangay-organized directory** – Browse gyms by location
- **Google Maps integration** – Direct navigation links for each gym
- **Auto-generated sitemap** – For SEO crawling via `@nuxtjs/sitemap`
- **Clean, responsive UI** – Optimized for mobile and desktop

### Planned Features
- **Nearby gyms** – Detect user location, resolve their barangay, and show the closest gyms

---

## Tech Stack

### Frontend
- **Nuxt 4** + **TypeScript** – SSG framework with type-safe component architecture
- **TailwindCSS** – Utility-first styling
- **Pinia** – Client/UI state management

### External Services
- **Cloudinary** – Image hosting and optimization
- **Google Maps Javascript API** – Interactive location previews
- **Google Maps Static API** – Static map snapshots

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** (or **pnpm**/yarn)

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:
```env
NUXT_PUBLIC_GOOGLE_MAP_API_KEY=
NUXT_PUBLIC_GOOGLE_MAP_JS_API_MAP_ID=
```

### Installation
```bash
# Clone the repository
git clone https://github.com/khentdev/puertoprincesagyms-nuxt.git
cd puertoprincesagyms-nuxt

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Build
```bash
# Generate static site
npm run generate

# Preview the generated output
npm run preview
```

---

## Contact

For questions or feedback, reach out via:
- **GitHub Issues:** [Submit an issue](https://github.com/khentdev/puertoprincesagyms/issues)
- **Email:** khentdevph@gmail.com

---

**Built with ❤️ for the Puerto Princesa fitness community**