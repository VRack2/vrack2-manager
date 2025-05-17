<template>
    <div class="control-widget-card  m-0 rounded-0">
        <!-- <div class="card-header">{{ service.name }}({{ service.id }})</div> -->
        <div class="card-body p-1 d-flex align-items-center">
          <div class="btn-group rounded-0" role="group" aria-label="Basic example">
            <button title="Проверка сервиса" type="button" @click="actionCheck()"
              :disabled="block" class="btn btn-primary"><i class="bi bi-exclamation-circle-fill"></i></button>
            <button title="Запуск сервиса" type="button" @click="actionRun()"
              :disabled="block || !remote.checkAccess('serviceStart') || service.run" class="btn btn-success"><i
                class="bi bi-play-fill"></i></button>
            <button title="Остановка сервиса" type="button" @click="actionStop()"
              :disabled="block || !remote.checkAccess('serviceStop') || !service.run" class="btn btn-danger"><i
                class="bi bi-stop-fill"></i></button>
            <button title="Перезапуск сервиса" type="button" @click="actionReload()"
              :disabled="block || !remote.checkAccess('serviceStart') || !remote.checkAccess('serviceStop') || !service.run"
              class="btn btn-warning"><i class="bi bi-arrow-counterclockwise"></i></button>
            <button title="Удалить ошибки сервиса" type="button" @click="actionDeleteErrors()" :disabled="block || !service.errors"
              class="btn btn-secondary"><i class="bi bi-trash3-fill"></i>ошибки</button>
          </div>
          <!-- <span v-if="service.run" class="ms-3 border rounded p-1"><b><i class="bi bi-activity text-success m-1"></i></b> <span class="m-1">{{ moment(service.startedAt).fromNow() }}</span></span> -->
        </div>
    </div>
  </template>
  <script>
  
  import { inject, ref } from 'vue';  
  export default {
    name: 'ManagerIndexView',
    components: { },
    setup() {
      const form = ref({})
      const service = inject('service')
      const remote = inject('remote')
      const setMessage = inject('setMessage')
      const setMap = inject('setMap')
      const block = ref(false)
      const serviceErrors = ref([])

      return { form, service, remote, block, setMessage, setMap, serviceErrors }
    },
  
    methods: {

      actionCheck() {
        return this.action('serviceCheck')
      },

      actionRun() {
        return this.action('serviceStart')
      },
      actionStop() {
        return this.action('serviceStop')
      },

      async actionReload() {
        await this.actionStop()
        await this.actionRun()
      },
  
      actionDeleteErrors() {
        return this.action('serviceErrorsClear')
      },

      async action(command){
        this.block = true
        try {
          await this.remote.command(command, { service: this.service.id })
        } catch (error) {
          this.setMessage('Error command ' + command, error.toString(), false, false)
        }
        this.block = false
      },
    }
  }
  </script>


<style>
.control-widget-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;
}
</style>