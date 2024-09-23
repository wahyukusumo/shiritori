import dictionary from '@/assets/words_dictionary.json';

export default class Shiritori {
  constructor(difficulty, userInput) {
    this.difficulty = difficulty;
    this.dictionary = dictionary;
    this.userInput = userInput;
  }

  isWordValid() {
    // Check if the user's input is a valid word in the dictionary
    return Object.prototype.hasOwnProperty.call(this.dictionary, this.userInput);
  }

  getRandomLetter() {
    let alphabet;
    switch (this.difficulty) {
      case 'easy':
        // Most commonly used letters (English): E, T, A, O, I, N, S, R
        alphabet = 'aeioutnrs';
        break;
      case 'medium':
        // Include more frequently used letters (English): L, C, D, P, M
        alphabet = 'aeioutnrsldcpm';
        break;
      case 'hard':
        // Add even less frequently used letters (English): H, G, B, F, Y
        alphabet = 'aeioutnrsldcpmhgbfy';
        break;
      case 'extreme':
        // Full alphabet
        alphabet = 'abcdefghijklmnopqrstuvwxyz';
        break;
    }

    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  userReplyMatchLastLetter(botWord) {
    if (botWord) {
      const botLastLetter = botWord.slice(-1);
      if (!this.userInput.startsWith(botLastLetter)) {
        return `Word should start with "${botLastLetter.toUpperCase()}"`;
      } else {
        return null;
      }
    }
  }

  botGetWord() {
    const lastLetter = this.userInput.slice(-1);
    let filteredWords, wordsStartWith;

    switch (this.difficulty) {
      case 'easy':
        // Filter words based on difficulty (for example, words of length 3-5 for easy)
        wordsStartWith = Object.keys(this.dictionary).filter(word => word.startsWith(lastLetter));
        filteredWords = wordsStartWith.filter(word => word.length >= 3 && word.length <= 5);
        break;
      case 'medium':
        // Medium difficulty (e.g., words of length 6-8)
        wordsStartWith = Object.keys(this.dictionary).filter(word => word.startsWith(lastLetter));
        filteredWords = wordsStartWith.filter(word => word.length >= 6 && word.length <= 8);
        break;
      case 'hard':
        // Hard difficulty (e.g., words longer than 8 letters)
        wordsStartWith = Object.keys(this.dictionary).filter(word => word.startsWith(lastLetter));
        filteredWords = wordsStartWith.filter(word => word.length > 8 && word.length <= 12);
        break;
      case 'extreme':
        // Hard difficulty (e.g., words longer than 12 letters)
        wordsStartWith = Object.keys(this.dictionary).filter(word => word.startsWith(lastLetter));
        filteredWords = wordsStartWith.filter(word => word.length > 12);
    }
    // Return a random word from the filtered words
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex];
  }
}
