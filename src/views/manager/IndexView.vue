<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">

        <div class="card mt-3" v-if="sysinfo.os">
          <div class="card-header"><i class="bi bi-server"></i> Системная информация</div>
          <table class="table table-striped  mb-0">
            <tbody>
              <tr><td width="50%">Имя хоста</td><td>{{ sysinfo.user.hostname }}</td></tr>
              <tr><td width="50%">Платформа</td><td>{{ sysinfo.os.platform }}</td></tr>
              <tr><td width="50%">Тип ОС</td><td>{{ sysinfo.os.type }}</td></tr>
              <tr><td width="50%">Релиз</td><td>{{ sysinfo.os.release }}</td></tr>
              <tr><td width="50%">Архитектура</td><td>{{ sysinfo.os.arch }}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card mt-3" v-if="sysinfo.os">
          <div class="card-header"><i class="bi bi-cpu-fill"></i> Данные CPU</div>
          <table class="table table-striped mb-0">
            <tbody>
              <tr><td width="50%">Модель</td><td>{{ sysinfo.cpu.model }}</td></tr>
              <tr><td width="50%">Количество ядер</td><td>{{ sysinfo.cpu.cores }}</td></tr>
              <tr><td width="50%">Скорость</td><td>{{ sysinfo.cpu.speed }}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card mt-3" v-if="sysinfo.os">
          <div class="card-header"><i class="bi bi-node-plus-fill"></i> Информация о NodeJS</div>
          <table class="table table-striped mb-0">
            <tbody>
              <tr><td width="50%">Версия</td><td>{{ sysinfo.node.version }}</td></tr>
              <tr><td width="50%">Движок V8</td><td>{{ sysinfo.node.v8 }}</td></tr>
              <tr><td width="50%">OpenSSL</td><td>{{ sysinfo.node.openssl }}</td></tr>
              <tr><td width="50%">PID процесса</td><td>{{ sysinfo.node.pid }}</td></tr>
              <tr><td width="50%">Аптайм</td><td>{{ sysinfo.node.uptime }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col">
        <MetricsControlWidget :control="control"></MetricsControlWidget>
        <MetricsGraphWidget :control="control" :metric="memory"></MetricsGraphWidget>
        <MetricsGraphWidget :control="control" :metric="wsprovider"></MetricsGraphWidget>
      </div>
    </div>

  </div>
</template>
<script>

import { inject, ref } from 'vue';
import { Metrics, MetricsControl } from '@/classes/Metrics'
import MetricsControlWidget  from '@/components/MetricsControlWidget.vue';
import MetricsGraphWidget from '@/components/MetricsGraphWidget.vue';

export default {
  name: 'ManagerIndexView',
  components: {
    MetricsControlWidget,
    MetricsGraphWidget
  },
  setup() {
    const control = ref(new MetricsControl())
    // control.value.setSize('small')

    //Memory metric info
    const memory = new Metrics()
    memory.command = 'systemMetric'
    memory.name = 'Потребление памяти основным сервисом'
    memory.setUnit('MB')
    memory.addMetric('vrack', 'System', 'memory.rss')
    memory.addMetric('vrack', 'System', 'memory.heaptotal')
    memory.addMetric('vrack', 'System', 'memory.heapused')
    memory.addMetric('vrack', 'System', 'memory.external')
    memory.addMetric('vrack', 'System', 'memory.arraybuffers')

    //Websocket provider
    const wsprovider = new Metrics()
    wsprovider.command = 'systemMetric'
    wsprovider.name = 'Websocket траффик'
    wsprovider.setUnit('MB')
    wsprovider.addMetric('vrack', 'WSProvider', 'byte.send')
    wsprovider.addMetric('vrack', 'WSProvider', 'byte.receive')

    const sysinfo = ref({})
    
    const remote = inject('remote')
    return { control, memory, wsprovider, remote, sysinfo}
  },

  async mounted(){
    this.control.start()
    try {
      this.sysinfo = await this.remote.command('systemInfo',{})
    }catch (err){
      console.log(err)
    }
  },

  unmounted(){
    this.control.stop()
  }
}
</script>