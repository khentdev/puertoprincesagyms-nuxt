<template>
  <header
    class="flex flex-col md:flex-row md:items-center md:h-16 md:justify-between bg-bg-app"
  >
    <div class="space-y-1 md:space-y-2">
      <h1
        class="sm:text-3xl text-2xl text-text-high-contrast font-extrabold tracking-tight"
      >
        {{ selectedBarangayLabel }}
      </h1>
      <span class="text-xs sm:text-sm text-text-low-contrast">{{
        getGymCountLabel
      }}</span>
    </div>
    <div
      class="flex items-center justify-start gap-3 md:justify-center mt-10 md:mt-auto shrink-0"
    >
      <span class="text-xs sm:text-sm text-text-low-contrast">Sort By:</span>
      <div class="relative">
        <button
          @click.stop="toggleSortDropdown"
          class="flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-accent-border-focus px-4 py-1.5 rounded border border-border-subtle hover:bg-component-bg-hover active:bg-component-bg-active transition-colors duration-200"
        >
          <span class="text-xs sm:text-sm text-text-low-contrast">{{
            selectedSort.label
          }}</span>
          <Icon
            name="lucide:chevron-down"
            class="size-4 text-text-low-contrast transition-transform duration-200"
            :class="{ 'rotate-180': isSortDropdownOpen }"
          />
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="isSortDropdownOpen"
            v-on-click-outside.bubble="toggleSortDropdown"
            class="absolute right-0 mt-2 w-48 bg-bg-panel border border-border-subtle rounded-lg shadow-lg overflow-hidden z-50 p-1"
          >
            <button
              v-for="option in sortOptions"
              :key="option.key"
              @click="handleSelectSort(option)"
              class="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 rounded focus:outline-none focus:ring-2 focus:ring-accent-border-focus"
              :class="[
                selectedSort.key === option.key &&
                selectedSort.order === option.order
                  ? 'text-text-accent-low font-medium'
                  : 'text-text-low-contrast hover:bg-component-bg-hover hover:text-text-high-contrast',
              ]"
            >
              <div class="flex items-center justify-between">
                <span>{{ option.label }}</span>
                <Icon
                  name="lucide:check"
                  v-if="
                    selectedSort.key === option.key &&
                    selectedSort.order === option.order
                  "
                  class="size-4 text-text-accent-low"
                />
              </div>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { vOnClickOutside } from "@vueuse/components";
const gymStore = useGymStore();
const { selectedBarangay, allGymCount, getGymCountsInBarangay, selectedSort } =
  storeToRefs(gymStore);

const selectedBarangayLabel = computed(() =>
  selectedBarangay.value === "All Locations"
    ? "All Locations"
    : `Gyms in Brgy. ${selectedBarangay.value}`,
);

const getGymCountLabel = computed(() => {
  const count =
    selectedBarangay.value === "All Locations"
      ? allGymCount.value
      : getGymCountsInBarangay.value;
  const suffix = count === 1 ? "gym" : "gyms";

  return selectedBarangay.value === "All Locations"
    ? `Showing ${count} ${suffix} in Puerto Princesa`
    : `Showing ${count} ${suffix} in this area`;
});

const sortOptions = computed<SortOption[]>(() => {
  const baseOptions: SortOption[] = [
    { label: "Name (A-Z)", key: "name", order: "asc" },
    { label: "Name (Z-A)", key: "name", order: "desc" },
  ];

  if (selectedBarangay.value === "All Locations")
    return [
      ...baseOptions,
      { label: "Barangay (A-Z)", key: "barangay", order: "asc" },
      { label: "Barangay (Z-A)", key: "barangay", order: "desc" },
    ];

  return baseOptions;
});

const isSortDropdownOpen = ref(false);

const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value;
};

const handleSelectSort = (sort: SortOption) => {
  gymStore.setSelectedSort(sort);
  isSortDropdownOpen.value = false;
};

watch(
  selectedBarangay,
  (newVal) => {
    if (newVal !== "All Locations" && selectedSort.value.key === "barangay") {
      gymStore.setSelectedSort({
        label: "Name (A-Z)",
        key: "name",
        order: "asc",
      });
    }
  },
  { flush: "post" },
);
</script>
