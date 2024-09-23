<template>
  <div>
    <span :class="pingClass" style="animation-delay: 0s;" />
    <span :class="pingClass" style="animation-delay: 0.2s;" />
    <span :class="pingClass" style="animation-delay: 0.4s;" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      pingClass: 'relative inline-flex rounded-full mx-1 size-3 opacity-0 bg-violet-400 animate-typing',
    };
  }
}
</script>
