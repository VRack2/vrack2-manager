<template>
  <PanelNavList>
    <PanelNavElement v-for="device in structure" :key="'dev-' + device.id" :event="() => selectDevice(device.id)" :active="($route.params.device === device.id)">
      <span style="display: block" class="">
           <b>{{ device.id }}</b>
        </span>
        <div style="display: block" class="d-flex justify-content-between">
          <small> {{ device.type }} </small> 
          <div>
            <small><span  v-if="Object.keys(device.actions).length" class="badge ms-1 text-bg-warning">A</span></small>
            <small><span  v-if="Object.keys(device.metrics).length" class="badge ms-1 text-bg-info">M</span></small>
          </div>
        </div>
    </PanelNavElement>
  </PanelNavList>
</template>
<script>

import PanelNavElement from '@/components/SidePanel/PanelNavElement.vue';
import PanelNavList from '@/components/SidePanel/PanelNavList.vue';
import { inject } from 'vue';


export default {
  name: 'ServiceView',
  props: [],
  components: {
    PanelNavList,
    PanelNavElement
  },
  setup() {
    const service = inject('service')
    const remote = inject('remote')
    const setMessage = inject('setMessage')
    const structure = inject('structure')
    return { service, remote, setMessage, structure }
  },

  methods: {
    selectDevice(device){
      this.$router.push({ name: 'deviceGeneralInfo', params: { device } })
    }
  }
}
</script>

<style></style>