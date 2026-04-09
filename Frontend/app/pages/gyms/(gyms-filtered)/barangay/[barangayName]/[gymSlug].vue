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
const titleCaseBarangay = computed(() => gymStore.selectedBarangay);

const seoTitle = computed(
  () =>
    `${gymSlugToTitleCase.value} — Gym in ${titleCaseBarangay.value}, Puerto Princesa City, Palawan`,
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

const config = useRuntimeConfig();
const currentUrl = `${config.public.siteUrl}${route.path}`;
useSchemaOrg([
  defineLocalBusiness({
    "@type": "SportsActivityLocation",
    name: () => selectedGym.value?.name,
    "@id": () => selectedGym.value?.id,
    image: () => selectedGym.value?.profile_image,
    url: () =>
      selectedGym.value?.social_links?.find((s) => s.name === "website")
        ?.link || currentUrl,
    description: () =>
      `${selectedGym.value?.name} in ${selectedGym.value?.barangay}, Puerto Princesa City.`,
    telephone: () => selectedGym.value?.contact_info?.phone,
    email: () => selectedGym.value?.contact_info?.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: () => selectedGym.value?.structuredAddress?.streetAddress,
      addressLocality: () =>
        selectedGym.value?.structuredAddress?.addressLocality,
      addressRegion: () => selectedGym.value?.structuredAddress?.addressRegion,
      postalCode: () => selectedGym.value?.structuredAddress?.postalCode,
      addressCountry: () =>
        selectedGym.value?.structuredAddress?.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: () => selectedGym.value?.location?.lat,
      longitude: () => selectedGym.value?.location?.lng,
    },
    openingHoursSpecification: () => {
      const hours = selectedGym.value?.opening_hours;
      if (!hours) return undefined;

      const isAlwaysOpen = hours.every(
        (h) => h.opens === "00:00" && h.closes === "24:00",
      );

      if (isAlwaysOpen)
        return [
          {
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek: hours.map((h) => h.dayOfWeek),
            opens: "00:00",
            closes: "24:00",
          },
        ];

      return hours.map((h) => ({
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: h.dayOfWeek,
        opens: h.opens,
        closes: h.closes,
      }));
    },
  }),
]);

defineOgImage("GymDirectory.takumi", {
  title: `${gymSlugToTitleCase.value} — ${titleCaseBarangay.value}, Puerto Princesa`,
  description: `View photos, location, hours, and details for ${gymSlugToTitleCase.value}. Get directions and explore nearby gyms in one place.`,
});
</script>
