<template>
  <div
    @click="handleOpenModal"
    class="relative flex flex-col items-center justify-end cursor-pointer group"
  >
    <div
      class="absolute bottom-full mb-1 pointer-events-none z-10 flex flex-col items-center"
    >
      <div
        class="bg-component-bg border border-border-subtle text-text-high-contrast text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap"
      >
        {{ gymName }}
      </div>
      <div
        class="size-0 border-l-4 border-l-transparent border-t-4 border-t-component-bg border-r-4 border-r-transparent"
      ></div>
    </div>

    <div
      class="relative flex transition-transform duration-200 group-hover:scale-110 drop-shadow-md"
    >
      <svg
        width="36"
        height="44"
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-solid-bg"
      >
        <path
          d="M18 42.5C18 42.5 34.5 26.663 34.5 18C34.5 9.163 27.337 2 18 2C8.663 2 1.5 9.163 1.5 18C1.5 26.663 18 42.5 18 42.5Z"
          fill="currentColor"
          stroke="white"
          stroke-width="1"
        />
      </svg>
      <div class="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
        <Icon name="lucide:dumbbell" :size="16" class="text-white" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  gymId: string;
  gymName: string;
  barangayName: ValidBarangays;
}>();

const emit = defineEmits<{
  "open-modal": [{ id: string; name: string; barangayName: ValidBarangays }];
}>();

const handleOpenModal = () => {
  emit("open-modal", {
    id: props.gymId,
    name: props.gymName,
    barangayName: props.barangayName,
  });
};
</script>
