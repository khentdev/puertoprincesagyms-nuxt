<template>
  <div
    @click="handleOpenModal(gym)"
    class="flex flex-col h-full bg-bg-panel border cursor-pointer group border-border-subtle rounded-lg transition-all overflow-hidden duration-200 hover:border-border-strong hover:shadow-lg"
  >
    <div class="aspect-video w-full bg-component-bg relative overflow-hidden">
      <nuxt-img
        :src="gym.profile_image"
        :alt="gym.name"
        decoding="async"
        fetchpriority="low"
        class="w-full h-full object-cover rounded-t-lg transition-transform duration-500 hover:scale-110 scale-105"
        loading="lazy"
      />
    </div>
    <div class="flex flex-col flex-1 p-4 gap-2">
      <div>
        <h3
          class="text-lg font-semibold text-text-high-contrast leading-tight mb-1"
        >
          {{ props.gym.name }}
        </h3>
        <div
          class="flex items-center gap-1.5 text-sm text-text-low-contrast font-medium"
        >
          <Icon name="lucide:map-pin" class="size-4 shrink-0" />
          <p>{{ props.gym.barangay }}</p>
        </div>
      </div>

      <div class="flex items-start gap-2 text-sm text-text-low-contrast mt-1">
        <span class="line-clamp-2">{{ props.gym.address }}</span>
      </div>

      <div
        class="mt-auto grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-in-out pt-2 md:pt-0 md:group-hover:pt-2"
      >
        <div class="overflow-hidden min-h-0">
          <button
            class="py-2 rounded-md text-text-accent-low text-sm font-medium group/button transition-colors active:cursor-pointer flex items-center justify-center gap-2"
          >
            View Details
            <Icon
              name="lucide:arrow-right"
              class="size-4 transition-transform duration-200 group-hover/button:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface GymCardProps {
  gym: GymCardData;
}

const props = defineProps<GymCardProps>();

const emit = defineEmits<{
  "open-gym-details-modal": [gym: GymCardData];
}>();

const handleOpenModal = (gym: GymCardData) => {
  emit("open-gym-details-modal", gym);
};
</script>
