<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300 ease-in-out"
      leave-active-class="transition-opacity duration-300 ease-in-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && currentImage"
        class="fixed inset-0 z-60 flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        @click.self="close"
      >
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-md"
          @click="close"
        ></div>

        <button
          @click="close"
          class="absolute flex items-center justify-center top-4 right-4 size-10 shrink-0 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg cursor-pointer"
          aria-label="Close image viewer"
        >
          <Icon name="lucide:x" :size="24" />
        </button>

        <button
          v-if="images.length > 1"
          @click="prevImage"
          class="absolute left-4 top-1/2 flex items-center justify-center -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg cursor-pointer"
          aria-label="Previous image"
        >
          <Icon name="lucide:chevron-left" :size="24" />
        </button>

        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 flex items-center justify-center -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg cursor-pointer"
          aria-label="Next image"
        >
          <Icon name="lucide:chevron-right" :size="24" />
        </button>

        <div
          v-if="images.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium shadow-lg"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <div
          @click="close"
          class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
        >
          <transition
            mode="out-in"
            enter-active-class="transition-opacity duration-200 ease-in-out"
            leave-active-class="transition-opacity duration-200 ease-in-out"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <nuxt-img
              :key="currentIndex"
              :src="currentImage.url"
              :alt="currentImage.alt"
              class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              @click.stop
            />
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script lang="ts" setup>
interface ImageItem {
  url: string;
  alt: string;
}
interface ImageViewerProps {
  isOpen: boolean;
  images: ImageItem[];
  initialIndex?: number;
}

const props = withDefaults(defineProps<ImageViewerProps>(), {
  initialIndex: 0,
});
const emit = defineEmits<{
  close: [];
}>();
const currentIndex = ref(0);
const currentImage = computed(() => {
  if (props.images.length === 0) return null;
  return props.images[currentIndex.value];
});

watch(
  () => props.initialIndex,
  (newIndex) => {
    if (newIndex >= 0 && newIndex < props.images.length) {
      currentIndex.value = newIndex;
    }
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      currentIndex.value = props.initialIndex;
    }
  },
);

function close() {
  emit("close");
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
}

function prevImage() {
  currentIndex.value =
    currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.isOpen) return;
  if (e.key === "Escape") {
    e.stopImmediatePropagation();
    close();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    nextImage();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    prevImage();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
