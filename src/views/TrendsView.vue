<template>
  <nav class="navbar bg-body-tertiary mt-1">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <label class="form-label m-0 me-3">Период</label>
        <select class="form-select" v-model="activePreset">
          <option v-for="(val, ds) of preset" :key="'period-' + val" :value="ds">
            {{ val }}
          </option>
        </select>
      </div>
    </div>
  </nav>
  <div class="container">
    <div class="row mt-3" v-for="dd in metrics" :key="dd.caption">
      <div class="d-flex justify-content-center">
        <span class="mt-3">{{ dd.caption }} ({{ dd.unit }})</span>
      </div>
      <GraphView :metric="$route.params.host + '.' + dd.metric"></GraphView>
    </div>
  </div>
</template>


<script>
import GraphView from '@/components/GraphView.vue';
import { provide, ref } from 'vue'



export default {
  name: 'HostView',
  components: { GraphView },
  setup() {
    const preset = {
      "now-5m:now": "5  Минут",
      "now-15m:now": "15 Минут",
      "now-30m:now": "30 Минут",
      "now-1h:now": "1 Час",
      "now-3h:now": "3 Часа",
      "now-6h:now": "6 Часов",
      "now-24h:now": "1 День",
      "now-2d:now": "2 Дня",
      "now-7d:now": "7 Дней",
    };

    const metrics = [
      { caption: 'Доступно "/"', metric: 'fsinfo.avail', unit: 'GB' },
      { caption: 'Занято "/"', metric: 'fsinfo.used', unit: 'GB' },
      { caption: 'Запущено инстансов', metric: 'manager.runned', unit: 'Кол.' },
      { caption: 'Оперативная Память', metric: 'manager.memory', unit: '%' },
      { caption: 'CPU', metric: 'manager.cpu', unit: '%' },
    ]

    const activePreset = ref('now-6h:now')
    provide('preset', activePreset)
    return { preset, activePreset, metrics }
  },

}
</script>
