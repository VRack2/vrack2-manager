<template>
  <div class="card mt-2" v-if="Subscribes.registered.length">
    <div class="card-header">
      Список подключеных каналов
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="regs of Subscribes.registered" class="list-group-item" :key="regs.service + regs.device + regs.target">
        <div class="d-flex justify-content-between align-items-center">
          <div><span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ regs.service }}</span>.<span class="text-secondary">devices</span>.<span class="text-info">{{ regs.device }}</span>.<span class="text-light">{{ regs.target }}</span></div>
          <button type="button" class="btn btn-sm btn-danger" @click="remove(regs.service, regs.device, regs.target)" ><i class="bi bi-x-circle-fill"></i> Отключить</button>
        </div>
      </li>
    </ul>
  </div>
  <EmptyChannelsView v-if="!Subscribes.registered.length"></EmptyChannelsView>
</template>
<script>

  import { inject } from 'vue';
import EmptyChannelsView from './EmptyChannelsView.vue';

export default {
  name: 'ChannelsView',
  components: {
    EmptyChannelsView
  },
  setup() {
    const Subscribes = inject('Subscribes')
    return { Subscribes }
  },
  methods: {
    remove(service, device, target){
      this.Subscribes.unRegisterChannel(service, device, target)
    }
  }
}
</script>


<style>
.h100 {
  height: 100%;
}
</style>