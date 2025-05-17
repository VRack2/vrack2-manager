<template>
  <div class="container-fluid" v-if="device">
    <h3 class="mt-3 mb-0">
      <span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ $route.params.service
        }}</span>.<span class="text-secondary">devices</span>.<span class="text-info">{{ device.id }}</span>
    </h3>
    <small style="font-size:medium;" class="text-secondary">({{ device.type }})</small>
    <ul class="nav nav-tabs mt-2">
      <li class="nav-item">
        <router-link :to="{ name: 'deviceGeneralInfo' }" class="nav-link" active-class="active">Информация</router-link>
      </li>
      <li class="nav-item">
        <!-- <a class="nav-link" href="#">События & Данные</a> -->
        <router-link :to="{ name: 'deviceChannels' }" class="nav-link" active-class="active">События & Данные</router-link>
      </li>
      <li class="nav-item"  v-if="Object.keys(device.actions).length">
        <router-link :to="{ name: 'deviceActions' }" class="nav-link" active-class="active">Экшены</router-link>
      </li>
      <li class="nav-item" v-if="Object.keys(device.metrics).length">
        <router-link :to="{ name: 'deviceMetrics' }" class="nav-link" active-class="active">Метрики</router-link>
      </li>
    </ul>
    <router-view v-if="device" />
  </div>
</template>
<script>
import { inject, ref, provide } from 'vue';

import { DeviceSVG } from '@/classes/DeviceSVG';

export default {
  name: 'ManagerIndexView',
  components: {},
  mounted() {
    this.device = this.structure[this.$route.params.device]
    this.DeviceSVG = new DeviceSVG()
    this.DeviceSVG.setDevice(this.device)
    // this.getDeviceInfo()
  },
  watch: {
    'structure': function () {
      this.device = this.structure[this.$route.params.device]
      this.DeviceSVG = new DeviceSVG()
      this.DeviceSVG.setDevice(this.device)
      // this.getDeviceInfo()
    }
  },
  setup() {
    const device = ref(false)
    const structure = inject('structure')
    const remote = inject('remote')
    const ODeviceSVG = ref(new DeviceSVG())
    provide("device", device)
    provide("DeviceSVG", ODeviceSVG)
    const info = ref(false)
    return { device, structure, remote, info, DeviceSVG: ODeviceSVG }
  },

  methods: {}
}
</script>