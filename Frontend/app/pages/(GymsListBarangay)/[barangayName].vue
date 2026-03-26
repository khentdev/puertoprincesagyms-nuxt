<template>
  <section
    class="h-[calc(100dvh-122px)] overflow-y-auto px-5 py-6 md:py-10 space-y-5 md:space-y-8"
  >
    <header-title />
  </section>
</template>
<script lang="ts" setup>
import type { ValidBarangays } from "~/store";
definePageMeta({
  layout: "default",
  name: "barangay",
  path: "/barangay/:barangayName?",
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

</script>
