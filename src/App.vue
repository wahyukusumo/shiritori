<script setup>
import BubbleChat from './components/BubbleChat.vue';
import TextArea from './components/TextArea.vue';
import NavArea from './components/NavArea.vue';
import ChooseMode from './components/ChooseMode.vue';
import WarningAlert from './components/WarningAlert.vue';
import { PlayIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="container mx-auto max-w-lg bg-slate-300 h-dvh">

    <ChooseMode v-show="!showGameChatScreen" @choose-difficulty="loadChatData" />

    <WarningAlert v-show="game.userInput.error && showGameChatScreen" :error="game.userInput.error" />

    <div v-if="showGameChatScreen" id="message-area" class="relative overflow-y-scroll h-full scrollbar-thin"
      ref="messageContainer">

      <NavArea :gameSaves="game" @hide-chat="(b) => showGameChatScreen = b" />

      <div class="flex flex-col gap-4 p-6 py-28">
        <BubbleChat v-for="(message, index) in game.messages" :key="index" :from="message.from" :game="message.game"
          :message="message" :difficulty="game.difficulty" />
        <BubbleChat from="me" :isTyping="game.isTyping.me" />
        <BubbleChat from="bot" :isTyping="game.isTyping.bot" />
      </div>

      <TextArea :timer="game.timer.timeLeft" :gameWord="game.gameWord" :isGameStart="game.isGameStart">
        <!-- Start Button -->
        <button type="button" @click="startTheGame()" v-if="!game.isGameStart"
          class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4
          focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center me-2">
          <PlayIcon class="size-5" />
        </button>

        <form @submit.prevent="userResponse()" class="w-full">
          <input type="text" @input="userInputHandle" v-model="game.userInput.value" :disabled="!game.isMyTurn" :placeholder="game.placeholder" required autofocus
          ref="userInputForm" class="text-md rounded-2xl w-full p-2.5 border" :class="{
            'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500': game.userInput.error,
            'bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-400 focus:border-violet-400': !game.userInput.error,
            'bg-gray-400': !game.isMyTurn
          }">
        </form>
      </TextArea>
    </div>

  </div>
</template>

<script>
import Shiritori from '@/shiritori.js';

export default {
  data() {
    return {
      showGameChatScreen: false,
      game: { // Only data needed for load the app
        timer: {
          initialTime: 0, // Initial time in seconds
          timeLeft: 0, // Time left in seconds
          intervalId: null,
          isPlaying: false, // Start paused
        },
        userInput: {
          value: null,
          error: null
        },
      },
      shiritori: null
    };
  },
  methods: {
    startTimer() {
      if (this.game.timer.isPlaying) return; // Prevent starting multiple intervals

      this.game.timer.isPlaying = true;
      this.game.timer.intervalId = setInterval(() => {
        if (this.game.timer.timeLeft > 0) {
          this.game.timer.timeLeft--;
        } else {
          this.changePlayerTurn();
        }
      }, 1000);
    },

    pauseTimer() {
      this.game.timer.isPlaying = false;
      if (this.game.timer.intervalId) {
        clearInterval(this.game.timer.intervalId); // Pause the countdown by clearing the interval
        this.game.timer.intervalId = null;
      }
    },

    resetTimer() {
      this.game.timer.timeLeft = this.game.timer.initialTime;
      this.pauseTimer(); // Clear any existing interval and pause the timer
    },

    scrollToBottomView() {
      this.$nextTick(() => {
        const messageContainer = this.$refs.messageContainer;
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });
    },

    isUserTyping() {
      const typingState = this.game.isTyping;
      typingState.me = true;
      clearTimeout(typingState.timeout);

      typingState.timeout = setTimeout(() => {
        typingState.me = false;
      }, 500);
    },

    // Game Method
    loadChatData(gameData) {
      this.showGameChatScreen = true;
      this.game = gameData;
      this.shiritori = new Shiritori(gameData.difficulty, '');
      this.$nextTick(() => this.$refs.userInputForm.focus());

      if (gameData.difficulty !== 'rules') {
        if (!this.game.messages.length) {
          this.sendChat('me', "Let's play shiritori!!", 500);
          this.sendChat('bot', gameData.quip, 1300);
        }
      } else {
        if (!this.game.messages.length) {
          this.sendChat('me', "What is the rules?", 500);
          this.sendChat('bot', gameData.quip, 1300);
        }
      }

    },

    startTheGame() {
      this.game.isGameStart = true;
      this.isMyTurn = true;
      this.game.score.me = this.game.score.base;
      this.game.score.bot = this.game.score.base;
      this.game.gameWord = this.shiritori.getRandomLetter();
      this.startTimer();
    },

    chatScore(message) {
      if (this.game.isGameStart) {
        return Number(message.length) - 4 + this.game.timer.timeLeft;
      } else {
        return 0;
      }
    },

    gameEndSequence(from) {
      this.game.isGameStart = false;
      this.pauseTimer();
      this.isMyTurn = true;
      const chatFrom = (from === 'me') ? 'bot' : 'me';
      setTimeout(() => {
        this.sendChat(chatFrom, this.botChatPickResponse(this.game.chat.lost)); // Loser Chat
        this.sendChat(from, this.botChatPickResponse(this.game.chat.won)); // Winner Chat
      }, 500)
    },

    countTotalScore(from, wordScore) {
      const currentScore = this.game.score[from];
      const newScore = Math.max(0, currentScore - wordScore); // Ensure score doesn't go negative
      this.game.score[from] = newScore;

      if (newScore <= 0) {
        this.gameEndSequence(from);
        return false;
      }

      return true;
    },

    sendChat(from, message, delay = 0) {
      this.game.isTyping[from] = true;

      return new Promise((resolve) => {
        setTimeout(() => {
          let isGameStillRun;
          const wordScore = this.chatScore(message)
          const chat = {
            from: (from === 'me') ? 'me' : 'bot',
            message: message,
            timer: this.game.timer.timeLeft,
            score: wordScore,
            game: this.game.isGameStart,
          }

          if (this.game.isGameStart) {
            isGameStillRun = this.countTotalScore(from, wordScore);
          }

          this.game.messages.push(chat);
          this.game.isTyping[from] = false;
          this.game.gameWord = message.at(-1);
          this.scrollToBottomView();
          resolve(isGameStillRun);
        }, delay);
      });
    },

    changePlayerTurn(gameRun = true) {
      if (gameRun) {
        this.resetTimer(); // Stop the timer when it reaches 0
        this.startTimer();
        this.game.isMyTurn = !this.game.isMyTurn;   // Automatically move to the next player when time runs out
        this.$nextTick(() => this.$refs.userInputForm.focus());

        if (!this.game.isMyTurn && this.game.isGameStart) {
          this.botGameResponse();
        }
      } else {
        this.game.isMyTurn = true;
      };
    },

    userInputHandle(event) {
      this.scrollToBottomView();
      this.isUserTyping();
      const inputValue = event.target.value;

      if (this.game.isGameStart && inputValue.at(0) !== this.game.gameWord) {
        this.game.userInput.error = `Word should start with "${this.game.gameWord.toUpperCase()}"`;
      }
    },

    // Main User Response
    userResponse() {
      const userInput = this.game.userInput.value;
      this.game.isGameStart ? this.userGameResponse(userInput) : this.userChatResponse(userInput);
      this.game.isTyping.me = false;
    },

    userChatResponse(userInput) {
      this.sendChat('me', userInput);
      this.botChatResponse();
      this.clearUserInput();
    },

    async userGameResponse(userInput) {
      this.shiritori.userInput = userInput;

      if (userInput.length < 4) {
        this.game.userInput.error = `Word must be 4 or more characters.`;
        return;
      }

      if (this.shiritori.isWordValid()) {
        let gameRun = await this.sendChat('me', userInput);
        this.clearUserInput();
        this.changePlayerTurn(gameRun);
      } else {
        this.game.userInput.error = `${userInput} is not valid word`;
      }
    },

    clearUserInput() {
      this.game.userInput.value = ''; // reset user input
      this.game.userInput.error = null;
    },

    async botGameResponse() {
      this.shiritori.userInput = this.game.gameWord;
      const botGetWord = this.shiritori.botGetWord();
      const delay = Math.random() * (this.game.timer.initialTime * 1000) - 2000;
      let gameRun = await this.sendChat('bot', botGetWord, delay);

      this.changePlayerTurn(gameRun);
      // setTimeout(() => {
      // }, delay - 1000);
    },

    botChatResponse() {
      const userInput = this.game.userInput.value.toLowerCase();
      const responses = {
        hello: "Hiiii~",
        hi: this.botChatPickResponse(this.game.chat.greeting),
      };

      // Return the appropriate response if it exists
      if (responses[userInput]) {
        this.sendChat('bot', responses[userInput]);
      }
    },

    botChatPickResponse(listResponse) {
      return listResponse[Math.floor(Math.random() * listResponse.length)];
    }
  },
  beforeUnmount() {
    clearInterval(this.game.timer.intervalId); // Clear the interval when the component is unmounted
  }
};
</script>