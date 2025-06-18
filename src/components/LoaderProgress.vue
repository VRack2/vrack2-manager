<template>
    <span :class="{'loader-progress-animation': animated}" class="loader-progress"></span>
</template>
<script>
export default {
    name: 'LoaderProgress',
    props: ['animated', 'device'],
}
</script>

<style scoped>
.loader-progress {
  width: 100%;
  height: 6px;
  display: inline-block;
  background-color: #9A6D45;
  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.25) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.25) 75%, transparent 75%, transparent);
  font-size: 30px;
  background-size: 1em 1em;
  box-sizing: border-box;
}

.loader-progress-animation {
  animation: barStripe 3s linear infinite;
}

@keyframes barStripe {
  0% {
    background-position: 1em 0;
  }
  100% {
    background-position: 0 0;
  }
}

</style>