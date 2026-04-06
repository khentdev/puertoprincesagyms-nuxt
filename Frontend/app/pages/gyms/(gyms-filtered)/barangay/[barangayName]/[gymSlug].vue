<template>
  <teleport to="body">
    <shared-gym-details-modal @close="handleCloseGymDetailsModal" />
  </teleport>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "default",
  name: "gym-details-modal",
  middleware: (to) => {
    const gymStore = useGymStore();
    const gymSlug = to.params["gymSlug"] as string;
    if (!gymSlug) {
      gymStore.setSelectedBarangay("All Locations");
      return navigateTo({ name: "gyms-list-all" });
    }

    const gym = gymStore.gyms.find(
      (gym) => titleCaseToKebab(gym.name) === gymSlug,
    );
    if (!gym) {
      gymStore.setSelectedBarangay("All Locations");
      return navigateTo({ name: "gyms-list-all" });
    }
  },
});
const route = useRoute();
const gymStore = useGymStore();
const { selectedGym } = storeToRefs(gymStore);
const { closeSelectedGym } = gymStore;

const handleCloseGymDetailsModal = () => {
  closeSelectedGym();
  navigateTo({
    name: "barangay",
    params: { barangayName: route.params["barangayName"] as ValidBarangays },
  });
};

const gymSlug = computed(() => route.params["gymSlug"] as string);
const gymSlugToTitleCase = computed(() => kebabToTitleCase(gymSlug.value));
const titleCaseBarangay = computed(() =>
  kebabToTitleCase(gymStore.selectedBarangay),
);

const seoTitle = computed(
  () =>
    `${gymSlugToTitleCase.value} - Gym in ${titleCaseBarangay.value}, Puerto Princesa City, Palawan`,
);
const seoDescription = computed(
  () =>
    `Visit ${gymSlugToTitleCase.value} in ${titleCaseBarangay.value}, Puerto Princesa City, Palawan. View Location, opening hours, contact details, and get directions via Google Maps`,
);

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  ogImage: () => selectedGym.value?.profile_image,
  ogImageAlt: () => selectedGym.value?.name,
  twitterImage: () => selectedGym.value?.profile_image,
  twitterImageAlt: () => selectedGym.value?.name,
  robots: "index, follow",
});
</script>
