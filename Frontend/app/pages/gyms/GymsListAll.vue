<template>
  <section
    class="h-[calc(100dvh-122px)] overflow-y-auto px-5 py-6 md:py-10 space-y-5 md:space-y-8"
  >
    <div
      class="flex-1 max-h-[60vh] h-[60vh] bg-component-bg rounded-lg overflow-hidden"
    >
      <ClientOnly>
        <google-map
          ref="mapRef"
          :api-key="config.public.googleMapsApiKey"
          style="width: 100%; height: 100%"
          :center="ppcCenter"
          :zoom="15"
          :map-id="config.public.googleMapsMapId"
        >
          <marker-cluster :options="{ renderer: clusterRenderer() }">
            <custom-marker
              v-for="gym in filteredGyms"
              :key="gym.id"
              :options="{
                position: { lat: gym.location.lat, lng: gym.location.lng },
                title: gym.name,
              }"
            >
              <custom-map-marker
                :gym-name="gym.name"
                :gym-id="gym.id"
                :barangay-name="gym.barangay"
                @open-modal="handleOpenModal"
              />
            </custom-marker>
          </marker-cluster>
        </google-map>
        <template #fallback>
          <div
            class="w-full h-full flex items-center justify-center text-text-low-contrast text-sm"
          >
            Loading map…
          </div>
        </template>
      </ClientOnly>
    </div>
    <shared-header-title />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <shared-gym-card
        v-for="gym in filteredGyms"
        :key="gym.id"
        :gym
        @open-gym-details-modal="handleOpenModal"
      />
    </div>
  </section>
  <shared-gym-details-modal @close="handleCloseMapModal" />
</template>
<script lang="ts" setup>
import { CustomMarker, GoogleMap, MarkerCluster } from "vue3-google-map";

definePageMeta({
  layout: "default",
  path: "/gyms",
  name: "gyms-list-all",
});

const config = useRuntimeConfig();
const ppcCenter = { lat: 9.73917, lng: 118.73528 };
const gymStore = useGymStore();
const { filteredGyms } = storeToRefs(gymStore);

const router = useRouter();
const route = useRoute();

const handleOpenModal = ({ name }: { name: string }) => {
  if (document.fullscreenElement) document.exitFullscreen();

  const gymSlug = titleCaseToKebab(name);
  router.replace({ query: { gym: gymSlug } });
};

const handleCloseMapModal = () => {
  router.replace({ name: "gyms-list-all" });
};

watch(
  () => route.query["gym"],
  (gymSlug) => {
    if (gymSlug) {
      const gym = gymStore.gyms.find(
        (g) => titleCaseToKebab(g.name) === gymSlug,
      );
      if (gym) gymStore.setSelectedGym({ id: gym.id });
    } else gymStore.closeSelectedGym();
  },
  { immediate: true },
);

function clusterRenderer() {
  return {
    render: ({
      count,
      position,
    }: {
      count: number;
      position: google.maps.LatLng;
    }) => {
      const radius = 15 + Math.min(count, 20);
      const size = radius * 2;

      const content = document.createElement("div");

      content.className =
        "flex items-center justify-center bg-solid-bg text-white rounded-full border-2 border-white font-bold text-xs";
      content.style.width = `${size}px`;
      content.style.height = `${size}px`;
      content.textContent = String(count);

      return new google.maps.marker.AdvancedMarkerElement({
        position,
        content,
        title: `Cluster of ${count} gyms`,
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      });
    },
  };
}
const seoTitle =
  "Gyms in Puerto Princesa City, Palawan — Complete Fitness Directory";
const seoDescription =
  "Discover gyms across Puerto Princesa City, Palawan. Browse by barangay with Google Maps directions and find the best local fitness centers";

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  robots: "index, follow",
});

const origin = config.public.siteUrl;

useHead({
  link: [{ rel: "canonical", href: `${origin}/gyms` }],
});

useSchemaOrg([
  defineWebPage({
    "@type": "CollectionPage",
    name: seoTitle,
    description: seoDescription,
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        name: "Home",
        item: origin,
      },
      {
        name: "Gyms",
        item: `${origin}/gyms`,
      },
    ],
  }),
  defineItemList({
    "@type": "ItemList",
    itemListElement: () =>
      filteredGyms.value?.map((g, i) => {
        const barangaySlug = titleCaseToKebab(g.barangay);
        const gymSlug = titleCaseToKebab(g.name);
        const gymUrl = `${origin}/gyms/barangay/${barangaySlug}/${gymSlug}`;

        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "LocalBusiness",
            name: g.name,
            url: gymUrl,
            image: g.profile_image,
            description: `${g.name} in ${g.barangay}, Puerto Princesa City, Palawan`,
            telephone: g.contact_info?.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: g.structuredAddress?.streetAddress,
              addressLocality: g.structuredAddress?.addressLocality,
              addressRegion: g.structuredAddress?.addressRegion,
              postalCode: g.structuredAddress?.postalCode,
              addressCountry: g.structuredAddress?.addressCountry,
            },
          },
        };
      }),
  }),
]);

defineOgImage("GymDirectory.takumi", {
  title: "Looking for Gyms in Puerto Princesa?",
  description: "Find and compare the best gyms near you — all in one place.",
});
</script>
