<template>
  <section
    class="h-[calc(100dvh-122px)] overflow-y-auto px-5 py-6 md:py-10 space-y-5 md:space-y-8"
  >
    <div
      class="flex-1 max-h-[60vh] h-[60vh] bg-component-bg rounded-lg overflow-hidden"
    >
      <google-map
        :api-key="config.public.googleMapsApiKey"
        style="width: 100%; height: 100%"
        :center="ppcCenter"
        :zoom="15"
        :map-id="config.public.googleMapsMapId"
      >
        <marker-cluster>
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
  const gymSlug = titleCaseToKebab(name);
  router.replace({ query: { gym: gymSlug } });
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

const handleCloseMapModal = () => {
  router.replace({ name: "gyms-list-all" });
};
</script>
