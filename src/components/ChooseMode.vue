<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="w-full max-w-lg h-screen p-4 py-28 bg-white border border-gray-200 sm:p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-12">
      <h5 class="text-2xl font-bold leading-none text-gray-900">Choose Difficulty</h5>
    </div>

    <div class="flow-root">
      <ul role="list" class="divide-y divide-gray-200">
        <li class="py-3 sm:py-4 cursor-pointer" v-for="(difficulty, index) in difficulties" :key="index"
          @click="chooseDifficulty(index)">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="size-12 rounded-full flex items-center justify-center text-2xl uppercase"
                :class="badgeColor(difficulty.difficulty)">{{ difficulty.difficulty.at(0) }}</div>
              <!-- <img class="size-12 rounded-full" :src="imgSrc(difficulty.name)" alt="Profile image"> -->
            </div>
            <div class="flex-1 min-w-0 ms-4">
              <p class="text-md font-semibold capitalize text-gray-900 truncate">
                {{ difficulty.difficulty }}
                <!-- {{ difficulty.name }} -->
              </p>
              <p class="text-sm text-gray-500 truncate">
                <span class="capitalize text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                  :class="badgeColor(difficulty.difficulty)">
                  {{ difficulty.difficulty }}
                </span>
                {{ difficulty.quip }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900">
              <ChevronRightIcon class="size-6" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      difficulties: this.createDifficulties([
        { difficulty: "rules", name: "Ruri", quip: "You can check the rules here.", score: 0, time: 15 },
        { difficulty: "easy", name: "Elu", quip: "Let's play together!", score: 10, time: 10 },
        { difficulty: "medium", name: "Naraka", quip: "Huh!! You think you can beat me!?? ", score: 120, time: 12 },
        { difficulty: "hard", name: "Sasaki", quip: "Ok, are you ready? ", score: 150, time: 10 },
        { difficulty: "extreme", name: "Yorumi", quip: "Sure! I hope you already prepare.", score: 150, time: 8 }
      ])
    };
  },
  methods: {
    badgeColor(difficulty) {
      switch (difficulty) {
        case 'rules':
          return 'bg-yellow-100 text-yellow-900';
        case 'easy':
          return 'bg-emerald-300 text-emerald-900';
        case 'medium':
          return 'bg-blue-300 text-blue-900';
        case 'hard':
          return 'bg-rose-300 text-rose-900';
        case 'extreme':
          return 'bg-violet-300 text-violet-900';
      }
    },
    createDifficulties(difficultyData) {
      return difficultyData.map(difficulty => ({
        ...difficulty,
        messages: [],
        score: {
          base: difficulty.score,
          me: difficulty.score,
          bot: difficulty.score
        },
        isGameStart: false,
        placeholder: 'Message',
        isTyping: {
          me: false,
          bot: false,
          timeout: false // Timeout typing only for me/user.
        },
        gameWord: '',
        isMyTurn: true,
        userInput: {
          value: null,
          error: null
        },
        disabledUserInput: false,
        timer: {
          initialTime: difficulty.time,
          timeLeft: difficulty.time,
          intervalId: null,
          isPlaying: false
        },
        chat: {
          // agreeing: 'ok.webp',
          // greeting: 'hi.webp',
          // lost: 'lost.webp',
          // won: 'won.webp',
          agreeing: ['😊', '👍', 'ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧', 'ദ്ദി ˉ͈̀꒳ˉ͈́ )✧'],
          greeting: ['(⌒∇⌒)/', 'ヾ(•ω•`)o', '✮⋆˙(˶ᵔ ᵕ ᵔ˶)'],
          lost: ['(っ °Д °;)っ', '＞︿＜', 'ಥ_ಥ', '🙁'],
          won: ['(✿◡‿◡)', '(*^_^*)', '😀', '🥳'],
        }
      }));
    },
    chooseDifficulty(id) {
      this.$emit('choose-difficulty', this.difficulties[id]);
    },
    imgSrc(image) {
      return new URL(`../assets/images/profile/${image}.webp`, import.meta.url).href;
    }
  },
  props: ['from', 'message', 'isTyping']
}
</script>