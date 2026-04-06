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
        @open-gym-details-modal="handleOpenModal"
      />
    </div>
  </section>
  <NuxtPage />
</template>
<script lang="ts" setup>
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

const route = useRoute();
const gymStore = useGymStore();
const { filteredGyms } = storeToRefs(gymStore);

const handleOpenModal = (gym: GymCardData) => {
  gymStore.setSelectedGym(gym);
  navigateTo({
    name: "gym-details-modal",
    params: { gymSlug: titleCaseToKebab(gym.name) },
  });
};

watch(
  () => route.params["gymSlug"] as string,
  (gymSlugParams) => {
    if (gymSlugParams) {
      const gym = gymStore.gyms.find(
        (gym) => titleCaseToKebab(gym.name) === gymSlugParams,
      );
      if (gym) gymStore.setSelectedGym(gym);
    }
  },
  { immediate: true },
);

const titleCaseBarangay = computed(() =>
  kebabToTitleCase(gymStore.selectedBarangay),
);

const seoTitle = computed(
  () =>
    `Gyms in ${titleCaseBarangay.value}, Puerto Princesa City, Palawan - Find Fitness Centers`,
);
const seoDescription = computed(
  () =>
    `Discover gyms in ${titleCaseBarangay.value}, Puerto Princesa City, Palawan. Browse fitness centers by location with Google Maps directions for easy navigation`,
);

// TODO: Add ogImage, twitterImage, etc. later
useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  robots: "index, follow",
});
</script>
