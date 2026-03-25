<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <the-header />
    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 overflow-y-auto bg-bg-app">
        <slot />
      </div>
    </div>
  </div>
</template>
