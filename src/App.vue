<template>
  <router-view />
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default {
  setup() {},
}
</script>

<style>
body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

html {
  height: 100%;
}

.main {
  height: 100vh;
  height: -webkit-fill-available;
  max-height: 100vh;
  /* overflow-x: auto; */
  overflow-y: hidden;
}

.sub-caption{
  font-size: 0.75rem;
  font-weight: bold;
}


.pre-caption{
  font-size: 0.9rem;
}

#app {
  height: 100%;
}

.my-link {
  cursor: pointer;
  text-decoration:underline;
}
</style>
