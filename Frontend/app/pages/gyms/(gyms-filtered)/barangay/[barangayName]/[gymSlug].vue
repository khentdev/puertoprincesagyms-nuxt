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
const { closeSelectedGym } = gymStore;

const handleCloseGymDetailsModal = () => {
  closeSelectedGym();
  navigateTo({
    name: "barangay",
    params: { barangayName: route.params["barangayName"] as ValidBarangays },
  });
};
</script>
