<template>
  <teleport to="body">
    <transition>
      <div
        v-if="selectedGym"
        class="modal-wrapper fixed inset-0 z-50 flex justify-center items-end md:items-center p-0 md:p-4"
      >
        <div
          @click="handleCloseGymDetailsModal()"
          class="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
        ></div>

        <div
          class="modal-content relative md:max-h-[85dvh] max-h-[90dvh] bg-bg-panel md:max-w-3xl shadow-md mx-auto w-full border border-border-subtle md:rounded-xl rounded-t-xl overflow-y-auto"
        >
          <button
            @click="handleCloseGymDetailsModal"
            class="absolute top-4 right-4 z-20 p-2 bg-component-bg/80 size-10 hover:bg-component-bg-hover backdrop-blur-sm text-text-high-contrast rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-border-focus shadow-sm border border-border-subtle cursor-pointer"
            aria-label="Close modal"
          >
            <Icon name="lucide:x" class="size-5" />
          </button>

          <div class="p-5 space-y-6">
            <!-- Brief Profile Information -->
            <div class="flex items-start flex-col md:flex-row gap-4 md:gap-6">
              <div
                class="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-component-bg group relative shadow-md border border-border-subtle cursor-pointer"
              >
                <nuxt-img
                  :src="selectedGym.profile_image"
                  :alt="`${selectedGym.name} profile`"
                  class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="high"
                  @click="openImageviewer(selectedGym.profile_image)"
                />
              </div>
              <div class="flex flex-col gap-2 flex-1 min-w-0 pt-1">
                <div class="space-y-1">
                  <div class="flex items-start justify-between gap-4">
                    <h2
                      class="text-2xl md:text-3xl font-bold text-text-high-contrast leading-tight tracking-tight"
                    >
                      {{ selectedGym.name }}
                    </h2>
                  </div>

                  <div
                    class="flex flex-col items-start gap-2 pt-1 text-text-low-contrast"
                  >
                    <div
                      class="flex items-center gap-1.5 text-sm text-text-low-contrast font-medium"
                    >
                      <Icon name="lucide:map-pin" class="size-4 shrink-0" />
                      <p>{{ selectedGym.barangay }}</p>
                    </div>
                    <p class="text-text-low-contrast leading-relaxed pl-1">
                      {{ selectedGym.address }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Map Integration -->
            <div
              class="border border-border-subtle rounded-lg relative overflow-hidden w-full h-52 md:h-72 bg-component-bg shadow-md"
            >
              <div
                v-if="isEmbedMapLoading"
                class="absolute inset-0 flex items-center justify-center bg-component-bg rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <Icon name="lucide:loader-2" class="animate-spin" />
                  <p class="text-text-low-contrast">Loading map...</p>
                </div>
              </div>
              <iframe
                v-if="!useFallback"
                :src="generateEmbedMapUrl(selectedGym)"
                width="100%"
                height="100%"
                style="border: 0"
                allowfullscreen="true"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                @load="onEmbedLoad"
              ></iframe>

              <nuxt-img
                v-else
                :src="staticMapUrl"
                :alt="`${selectedGym.name} map`"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
            <!-- Image Gallery -->
            <div class="grid grid-cols-2 gap-3 md:gap-4">
              <div
                v-for="(img, index) in selectedGym.images"
                :key="index"
                class="aspect-video rounded-lg overflow-hidden bg-component-bg border border-border-subtle shadow-sm relative group cursor-pointer"
                @click="openImageviewer(img)"
              >
                <nuxt-img
                  :src="img"
                  :alt="`${selectedGym.name} image ${index + 1}`"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 scale-105"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
              </div>
            </div>
            <!-- Opening Hours -->
            <template v-if="selectedGym.opening_hours">
              <div class="space-y-4">
                <h1 class="text-lg font-semibold text-text-high-contrast">
                  Opening Hours
                </h1>

                <div class="flex flex-col items-start justify-start gap-2">
                  <template
                    v-for="(hours, index) in selectedGym.opening_hours"
                    :key="index"
                  >
                    <div class="flex flex-col items-center">
                      <ul
                        class="flex items-center justify-between gap-2 w-full"
                      >
                        <li
                          class="font-semibold w-32 text-text-high-contrast"
                          v-if="hours.day"
                        >
                          {{ hours.day }}
                        </li>
                        <li
                          v-if="hours.time === 'Always Open'"
                          class="flex items-center gap-2"
                        >
                          <Icon
                            name="lucide:clock-check"
                            class="shrink-0 text-text-accent-low"
                          />
                          <p class="text-text-low-contrast">Always Open</p>
                        </li>
                        <li
                          v-else-if="hours.time === 'Closed'"
                          class="text-text-low-contrast"
                        >
                          Closed
                        </li>
                        <li v-else class="text-text-low-contrast">
                          {{ hours.time }} - {{ hours.close }}
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <!-- Contacts -->
            <template v-if="selectedGym.contact_info">
              <div class="space-y-4">
                <h1 class="text-lg font-semibold text-text-high-contrast">
                  Contact
                </h1>
                <div class="flex flex-col items-start justify-start gap-2">
                  <div
                    v-if="selectedGym.contact_info.phone"
                    class="flex items-center gap-2 text-text-high-contrast"
                  >
                    <Icon
                      name="lucide:phone"
                      class="shrink-0 text-text-accent-low"
                    />
                    <p class="text-text-low-contrast">
                      {{ selectedGym.contact_info.phone }}
                    </p>
                  </div>
                  <div
                    v-if="selectedGym.contact_info.email"
                    class="flex items-center gap-2 text-text-high-contrast"
                  >
                    <Icon
                      name="lucide:mail"
                      class="shrink-0 text-text-accent-low"
                    />
                    <p class="text-text-low-contrast">
                      {{ selectedGym.contact_info.email }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
            <!-- Social Links -->
            <template v-if="selectedGym.social_links">
              <div class="space-y-4">
                <h1 class="text-lg font-semibold text-text-high-contrast">
                  {{ socialLinkLabelPrefix }}
                </h1>
                <div class="flex items-center gap-4">
                  <template
                    v-for="(socialLink, i) in selectedGym.social_links"
                    :key="i"
                  >
                    <a
                      :href="socialLink.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-2 shadow-md rounded transform hover:-translate-y-0.5 hover:shadow-lg ease-in-out transition-all duration-300 hover:text-text-accent-low text-text-low-contrast"
                    >
                      <Icon
                        :size="24"
                        :name="socialLinkIconName(socialLink.name)!"
                        class="shrink-0"
                      />
                    </a>
                  </template>
                </div>
              </div>
            </template>
            <div class="sticky bottom-0 bg-bg-panel pb-2 pt-2">
              <a
                :href="selectedGym.map_link"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-lg bg-solid-bg hover:bg-solid-bg-hover text-solid-text font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] ring-1 ring-white/10"
              >
                <Icon name="lucide:external-link" class="size-5" />
                <span>Open in Google Map</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <image-viewer-modal
      :is-open="isImageViewerOpen"
      :images="viewerImages"
      :initial-index="viewerInitialIndex"
      @close="closeImageViewer"
    />
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
    gymStore.setSelectedGym(gym);
  },
});
const route = useRoute();
const gymStore = useGymStore();
const { closeSelectedGym } = gymStore;
const { selectedGym } = storeToRefs(gymStore);

const { onEmbedLoad, isEmbedMapLoading, useFallback } = handleEmbedMapLoading();

const socialLinkLabelPrefix = computed(() =>
  selectedGym.value?.social_links?.length === 1 ? "Social" : "Socials",
);

const MAX_CACHE_SIZE = 50;
const mapUrlCache = new Map<string, string>();

const staticMapUrl = computed(() => {
  if (!selectedGym.value) return "";

  const gymId = selectedGym.value.id;
  if (mapUrlCache.has(gymId)) return mapUrlCache.get(gymId);

  const barangayOptions = getBarangayMapOptions(selectedGym.value.barangay);
  const url = generateStaticMapUrl(selectedGym.value, barangayOptions);

  if (mapUrlCache.size >= MAX_CACHE_SIZE) {
    const [firstKey] = mapUrlCache.keys();
    if (firstKey) mapUrlCache.delete(firstKey);
  }

  mapUrlCache.set(gymId, url);
  return url;
});

const socialLinkIconName = (socialLink: string) => {
  if (socialLink)
    return {
      facebook: "lucide:facebook",
      instagram: "lucide:instagram",
      tiktok: "prime:tiktok",
      website: "lucide:globe",
    }[socialLink];
  return "lucide:link";
};

const handleCloseGymDetailsModal = () => {
  closeSelectedGym();
  navigateTo({
    name: "barangay",
    params: { barangayName: route.params["barangayName"] as ValidBarangays },
  });
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && selectedGym.value) {
    handleCloseGymDetailsModal();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const isImageViewerOpen = ref(false);
const viewerImages = computed(() => {
  if (!selectedGym.value) return [];

  const images = [];
  images.push({
    url: selectedGym.value.profile_image,
    alt: `${selectedGym.value.name} profile`,
  });

  if (selectedGym.value.images && selectedGym.value.images.length > 0) {
    selectedGym.value.images.forEach((img, index) => {
      images.push({
        url: img,
        alt: `${selectedGym.value!.name} image ${index + 1}`,
      });
    });
  }
  return images;
});

const viewerInitialIndex = ref(0);
function openImageviewer(ImageUrl: string) {
  const index = viewerImages.value.findIndex((img) => img.url === ImageUrl);
  viewerInitialIndex.value = index >= 0 ? index : 0;
  isImageViewerOpen.value = true;
}

function closeImageViewer() {
  isImageViewerOpen.value = false;
}
</script>
