<script setup>
import Ping from './TyPing.vue';
import { StarIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div v-if="message || isTyping" :class="fromClass[from]"
    class="px-6 py-2 rounded-t-2xl flex-initial max-w-[75%] break-words">
    <Ping v-if="isTyping" />
    <p v-else v-html="showMessage(message.message)" />
  </div>

  <!-- Score -->
  <small v-if="game" class="flex flex-row justify-center items-center gap-1 font-bold -mt-3 text-gray-500"
    :class="selfClass[from]">
    <StarIcon class="size-4" />
    <span>{{ message.score }}</span>
  </small>

</template>

<script>
export default {
  data() {
    return {
      selfClass: { 'me': 'self-end', 'bot': 'self-start' },
      fromClass: { 'me': 'bg-violet-300 rounded-bl-2xl self-end', 'bot': 'bg-gray-200 rounded-br-2xl self-start' },
    };
  },
  methods: {
    imgSrc(image) {
      return new URL(`../assets/images/stickers/${this.difficulty}/${image}`, import.meta.url).href;
    },
    showMessage(message) {
      if (message.endsWith('.webp')) {
        return `<img src="${this.imgSrc(message)}" alt="sticker" width="150px">`;
      } else {
        return message;
      }
    }
  },
  props: ['from', 'game', 'message', 'isTyping', 'difficulty']
}
</script>