<template>
  <router-view />
</template>
<script>
import { provide, ref } from "vue";

export default {
  name: "HomeView",
  components: {},
  mounted: function () {
    if (localStorage.settings) {
      this.settings = JSON.parse(localStorage.settings);
      if (!Array.isArray(this.settings.connections)) this.settings.connections = []
    }
  },

  setup: function () {
    const settings = ref({ connections: [] })
    provide("settings", settings);
    return { settings };
  },

  methods: {}
};
</script>

<style>
</style>
