<template>
  <header class="bg-bg-panel border-b border-border-default">
    <div class="w-full flex justify-between items-center px-3 md:px-5 py-2.5">
      <div class="flex items-center w-full gap-3">
        <NuxtImg
          src="./ppcgymslogo.png"
          alt="Puerto Princesa Gyms Directory Logo"
          class="rounded-full h-8 hidden sm:h-10 sm:block md:h-12"
        ></NuxtImg>
        <div>
          <h1 class="text-text-high-contrast text-sm md:text-base font-bold">
            Puerto Princesa Gym Directory
          </h1>
          <p class="text-xs md:text-sm text-text-low-contrast">
            Find your perfect workout spot in the city
          </p>
        </div>
      </div>
      <button
        class="bg-bg-panel flex shrink-0 items-center justify-center border border-border-default rounded-full relative w-9 h-9 hover:bg-component-bg-hover transition-colors cursor-pointer"
        @click="setColorMode"
        :aria-label="`Switch to ${color.preference === 'dark' ? 'light' : 'dark'} mode`"
      >
        <transition
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          enter-active-class="absolute w-full transition-opacity duration-200 ease-in-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          leave-active-class="absolute w-full transition-opacity duration-200 ease-in-out"
        >
          <Icon
            key="sun"
            name="lucide:sun"
            v-if="color.preference === 'dark'"
            class="text-text-high-contrast size-5"
          />
          <Icon
            key="moon"
            name="lucide:moon"
            v-else
            class="text-text-high-contrast size-5"
          />
        </transition>
      </button>
    </div>
    <nav class="px-3 md:px-5">
      <ul
        class="flex items-center w-full gap-3 py-3 overflow-x-auto scroll-smooth"
      >
        <li
          v-for="barangay in barangayNavigations"
          :key="barangay.id"
          :ref="(el) => setItemRef(el, barangay.id)"
          class="shrink-0 flex items-center rounded-2xl group shadow"
        >
          <button
            :class="[
              selectedBarangay === barangay.id
                ? 'bg-solid-bg text-white'
                : 'text-text-low-contrast hover:bg-component-bg-hover bg-component-bg cursor-pointer',
            ]"
            @click="handleBarangayClick(barangay.id)"
            class="flex items-center gap-2 px-3 w-full text-sm rounded-2xl py-1 transition-colors"
          >
            <Icon :name="barangay.icon" v-if="barangay.icon" />
            {{ barangay.label }}
            <span
              class="text-xs text-gray-300"
              v-show="selectedBarangay === barangay.id"
              >({{ getGymCountLabel }})</span
            >
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
const color = useColorMode();
const setColorMode = () => {
  color.preference = color.preference === "dark" ? "light" : "dark";
};

interface BarangayNavigations {
  icon?: string;
  id: Barangays;
  label: Barangays;
}
const barangayNavigations: BarangayNavigations[] = [
  {
    id: "All Locations",
    label: "All Locations",
    icon: "lucide:map",
  },
  {
    id: "San Pedro",
    label: "San Pedro",
  },
  {
    id: "San Miguel",
    label: "San Miguel",
  },
  {
    id: "Maunlad",
    label: "Maunlad",
  },
  {
    id: "San Manuel",
    label: "San Manuel",
  },
  {
    id: "Santa Monica",
    label: "Santa Monica",
  },
  {
    id: "San Jose",
    label: "San Jose",
  },
  {
    id: "Tagumpay",
    label: "Tagumpay",
  },
  {
    id: "Tiniguiban",
    label: "Tiniguiban",
  },
  {
    id: "Sicsican",
    label: "Sicsican",
  },
];

const gymStore = useGymStore();
const { selectedBarangay, getGymCountsInBarangay, allGymCount } =
  storeToRefs(gymStore);

const getGymCountLabel = computed(() =>
  selectedBarangay.value === "All Locations"
    ? allGymCount.value
    : getGymCountsInBarangay.value,
);

const itemRefs = new Map<Barangays, Element>();
const setItemRef = (el: unknown, id: Barangays) => {
  if (el instanceof Element) itemRefs.set(id, el);
};

const handleBarangayClick = (barangay: Barangays) => {
  gymStore.setSelectedBarangay(barangay);

  nextTick(() => {
    itemRefs.get(barangay)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });

  const sanitizedBarangayParam = barangay
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  if (barangay.toLowerCase() === "all locations") {
    navigateTo({ name: "gyms-list-all" });
  } else {
    navigateTo({
      name: "barangay",
      params: { barangayName: sanitizedBarangayParam },
    });
  }
};
</script>
<style scoped>
ul {
  scrollbar-width: none;
}
ul::-webkit-scrollbar {
  display: none;
}

@media (hover: none) and (pointer: coarse) {
  ul {
    scrollbar-width: thin;
    scrollbar-color: var(--border-default) transparent;
  }
  ul::-webkit-scrollbar {
    display: block;
    height: 3px;
  }
  ul::-webkit-scrollbar-track {
    background: transparent;
  }
  ul::-webkit-scrollbar-thumb {
    background-color: var(--border-default);
    border-radius: 9999px;
  }
}
</style>
