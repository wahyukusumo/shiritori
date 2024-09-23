<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="absolute bottom-24 max-w-lg z-30 w-full px-20">
    <div class="p-2 bg-yellow-500 rounded-lg text-sm font-semibold flex gap-2 items-center justify-center">
      <ExclamationTriangleIcon class="size-5" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>