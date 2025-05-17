<template>
  <div class="container-fluid">
    <div class="card mt-3">
      <div class="card-body d-flex align-items-center">
        <div><b>{{ service.name }}</b> ({{ service.id }})</div>
        <span v-if="service.run" class="ms-3 border rounded p-1"><b><i class="bi bi-activity text-success m-1"></i></b> <span class="m-1">{{ moment(service.startedAt).fromNow() }}</span></span>
        <button v-if="service.run" class="btn btn-dark btn-sm ms-2" @click="actionProcessMap()"><i class="bi bi-house-gear-fill"></i> Структура Процесса</button>
      </div>
    </div>
    <div v-if="service" class="row mt-3">
        <div class="col">
          <PanelListWidget header="Сервис" :params="params" :value="service"></PanelListWidget>
        </div>
        <div class="col">
          <PanelListWidget header="Мета данные" :params="metaParams" :value="service"></PanelListWidget>
        </div>
      </div>
      <div class="row">
        <div class="col">
        <MetricsControlWidget v-if="ready && service.run" :control="control"></MetricsControlWidget>
        <MetricsGraphWidget v-if="ready && service.run"  :control="control" :metric="memory"></MetricsGraphWidget>
        </div>
      </div>
  </div>
</template>
<script>

import { inject, ref } from 'vue';
import PanelListWidget from './PanelListWidget.vue';

import { Metrics, MetricsControl } from '@/classes/Metrics'
import MetricsControlWidget  from '@/components/MetricsControlWidget.vue';
import MetricsGraphWidget from '@/components/MetricsGraphWidget.vue';

import moment from 'moment';

moment.locale('ru')

export default {
  name: 'ManagerIndexView',
  components: { PanelListWidget,
    MetricsControlWidget,
    MetricsGraphWidget
   },
  setup() {
    const service = inject('service')
    const control = ref(new MetricsControl())
    const ready = ref(false)
    //Memory metric info
    const memory = new Metrics()
    memory.command = 'serviceMetric'
    memory.name = 'Потребление памяти сервиса'
    memory.setUnit('MB')



    const form = ref({})
    const remote = inject('remote')
    const setMessage = inject('setMessage')
    const setMap = inject('setMap')
    const block = ref(false)
    const serviceErrors = ref([])
    const params = [
      { name: 'id', label: 'ID' },
      { name: 'deleted', label: 'Удален?' },
      { name: 'filePath', label: 'Сервис файл' },
      { name: 'structurePath', label: 'Файл структуры' },
      { name: 'metaPath', label: 'Файл метаданных' },
      { name: 'configPath', label: 'Файл доп конфигурации' },
    ]

    const metaParams = [
      { name: 'name', label: 'Название' },
      { name: 'group', label: 'Группа' },
      { name: 'system', label: 'Является системным' },
      { name: 'autoStart', label: 'Автостарт' },
      { name: 'autoReload', label: 'Авторелоад' },
      { name: 'description', label: 'Описание' },
    ]

    return { form, service, remote, block, setMessage, setMap, params, metaParams, moment, serviceErrors, control, memory, ready }
  },

  watch: {
    "service.errors": function (){
      this.updateServiceErrors()
    }
  },

  mounted(){
    if (this.service && this.service.errors) { this.updateServiceErrors() }
    this.memory.addMetric(this.service.id , 'Service', 'memory.rss')
    this.memory.addMetric(this.service.id , 'Service', 'memory.heaptotal')
    this.memory.addMetric(this.service.id , 'Service', 'memory.heapused')
    this.memory.addMetric(this.service.id , 'Service', 'memory.external')
    this.memory.addMetric(this.service.id , 'Service', 'memory.arraybuffers')
    this.control.start()
    this.ready = true
  },
  
  beforeRouteLeave(to, from, next){
    next()
  },
  beforeUnmount(){
    this.control.stop()
  },

  methods: {
    async updateServiceErrors(){
      if (this.service.id){
        this.serviceErrors = await this.remote.command('serviceErrors', { service: this.service.id })
      }
    },
    async actionProcessMap(){
      try {
        const struct = await this.remote.command('structureGet', { id:  'worker::'+ this.service.id })
        const actions = []
        if (this.remote.checkAccess('structureUpdate')) {
          actions.push({
            caption: 'Save',
            action: async (structure) => {
              await this.remote.command('structureUpdate', { id: 'worker::'+ this.service.id,  structure })
            }
          })
        }
        this.setMap(struct, actions )
      } catch (error) {
        this.setMessage('Error set map', error.toString(), false, false)
      }
    },
  }
}
</script>