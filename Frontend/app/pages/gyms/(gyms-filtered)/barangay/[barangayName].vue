<template>
  <section
    class="h-[calc(100dvh-122px)] overflow-y-auto px-5 py-6 md:py-10 space-y-5 md:space-y-8"
  >
    <shared-header-title />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <shared-gym-card
        v-for="gym in filteredGyms"
        :key="gym.id"
        :gym
        :set-selected-gym="setSelectedGym"
      />
    </div>
  </section>
  <NuxtPage />
</template>
<script lang="ts" setup>
import type { ValidBarangays } from "~/store";
definePageMeta({
  layout: "default",
  name: "barangay",
  middleware: (to) => {
    const gymStore = useGymStore();

    const barangayNameParam = to.params["barangayName"] as string;

    if (!barangayNameParam?.trim()) {
      gymStore.setSelectedBarangay("All Locations");
      return navigateTo({ name: "gyms-list-all" });
    }

    const titleCaseBarangay = kebabToTitleCase(barangayNameParam);
    const isValidBarangay = VALID_BARANGAYS.includes(
      titleCaseBarangay as ValidBarangays,
    );

    if (!isValidBarangay) {
      gymStore.setSelectedBarangay("All Locations");
      return navigateTo({ name: "gyms-list-all" });
    }

    gymStore.setSelectedBarangay(titleCaseBarangay as ValidBarangays);
  },
});

const gymStore = useGymStore();
const { filteredGyms } = storeToRefs(gymStore);

const setSelectedGym = (gym: GymCardData) => {
  gymStore.setSelectedGym(gym);
  navigateTo({
    name: "gym-details-modal",
    params: { gymSlug: titleCaseToKebab(gym.name) },
  });
};
</script>
