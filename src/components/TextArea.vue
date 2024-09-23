<template>
  <div class="absolute w-full max-w-lg bottom-0 bg-gray-200 p-4 flex items-center justify-center gap-2">

    <div v-if="isGameStart" class="inline-flex rounded-md shadow-sm" role="group">
      <button type="button"
        class="inline-flex items-center px-4 py-2.5 text-sm font-medium bg-transparent rounded-s-2xl text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white">
        {{ timer }}
      </button>
      <button type="button"
        class="uppercase inline-flex items-center px-4 py-2.5 text-sm font-medium bg-transparent rounded-e-2xl text-blue-700 border border-l-0 border-blue-700 hover:bg-blue-700 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white">
        {{ gameWord }}
      </button>
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['timer', 'gameWord', 'isGameStart']
}
</script>