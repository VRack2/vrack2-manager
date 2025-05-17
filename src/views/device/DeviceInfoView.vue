<template>
    <div class="container-fluid">
        <DeviceInfoWidget :device="{ type: $route.params.device }" :key="$route.params.device"></DeviceInfoWidget>
    </div>
  </template>
  <script>
  import { inject, ref } from 'vue';
  
  import DeviceInfoWidget from '@/views/manager/device/DeviceInfoWidget.vue';
  
  export default {
    name: 'DeviceInfoView',
    components: { 
      DeviceInfoWidget
    },
    setup() {
      const device = ref(false)
      const structure = inject('structure')
      const remote = inject('remote')
      return { device, structure, remote }
    },

  }
  </script>