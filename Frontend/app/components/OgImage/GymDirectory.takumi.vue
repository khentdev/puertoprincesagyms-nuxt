<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: "Looking for Gyms in Puerto Princesa?",
    description: "Find and compare the best gyms near you — all in one place.",
  },
);
</script>

<template>
  <div
    class="w-full h-full flex flex-row items-center justify-between bg-[#F0F0F0] dark:bg-[#1A1A1A] p-10 font-sans"
  >
    <div class="flex flex-col pr-12">
      <div class="flex mb-6">
        <span
          class="bg-[#DAE8DF] dark:bg-[#163223] text-[#23392C] dark:text-[#ABF3C8] font-bold uppercase tracking-widest text-2xl px-5 py-2 rounded-lg"
        >
          Puerto Princesa Gym Directory
        </span>
      </div>

      <h1
        class="text-6xl font-bold leading-tight text-[#202020] mb-8 dark:text-[#ffffff]"
      >
        {{ title }}
      </h1>

      <p class="text-3xl text-[#202020]/80 dark:text-[#ffffff]/80 leading-snug">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center justify-center pl-8">
      <NuxtImg
        src="/puertoprincesagymslogo.svg"
        width="300"
        height="300"
        alt="Puerto Princesa Gyms Logo"
      />
    </div>
  </div>
</template>
