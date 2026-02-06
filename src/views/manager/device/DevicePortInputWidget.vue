<template>
  <div class="card mt-3">
    <div class="card-header">
      <div class="d-flex align-items-center justify-content-between ">
        <div class="h5 m-0" :class="{ 'my-link': !expand }" @click="toggle()">
          <span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ port.service }}</span>.<span class="text-secondary">devices</span>.<span class="text-info">{{port.device }}</span>.<span class="text-secondary">inputs</span>.<span class="text-danger-emphasis">{{ port.port }}</span>
        </div>
        <div>
          <button class="btn btn-sm btn-danger" @click="remove()"><i class="bi bi-dash-circle-fill"></i></button>
        </div>
      </div>
    </div>
    <!-- <LoaderProgress :animated="capture"></LoaderProgress> -->
    <!-- {{ port }} -->
    <div v-show="show">
      <div class="card-body">
        <div>Тело запроса</div>
        <textarea class="form-control" style="width:100%" v-model="request"></textarea>
      </div>
    </div>
    <div v-show="show && reqResult">
      <div class="m-2">
        Результат запроса:
      </div>
      <div v-if="reqResult" class="m-0">
          <pre class="m-0 console-pre">{{ reqResult }}</pre>
        </div>
    </div>
    <div class="card-body" v-if="show && reqError">
      Ошибка запроса:
      <ServiceError v-if="reqError" :error="reqError"></ServiceError>
    </div>
    <div  v-show="show" class="card-footer">
      <button @click="sendRequest()" :disabled="block" class="btn btn-sm btn-primary">Отправить</button>
      <span v-if="success">Отправлено</span>
    </div>
  </div>
</template>
<script>

import { inject, ref } from 'vue';
import ServiceError from '@/components/ServiceError.vue';
import { Utility } from '@/classes/Utility';

export default {
  name: 'ManagerIndexView',
  props: ['port'],
  components: {
    ServiceError,

  },

  mounted(){
      
  },

  setup() {
    const remote = inject('remote')
    const ConsoleWidgets = inject('ConsoleWidgets')
    const reqError = ref(false)
    const reqResult = ref(false)
    const show = ref(true)
    const request = ref('')
    const block = ref(false)
    const success = ref(false)

    return {
      remote,
      reqError,
      reqResult,
      request,
      show,
      block,
      ConsoleWidgets,
      success,
    }
  },

  methods: {
    toggle(){
      this.show = !this.show
    },

    remove(){
      this.ConsoleWidgets.removePort(this.port.id);
    },

    async sendRequest() {
      this.block = true
      try {
        const data = new Function(`return ${this.request};`)();
        console.log(data)
        this.reqResult = await this.remote.command('serviceDevicePush', {
          service: this.port.service,
          device: this.port.device,
          port: this.port.port,
          data
        })
        if (typeof this.reqResult === "string"){
          this.reqResult = Utility.escapeHtml(this.reqResult)
        }
        this.reqError = false
        this.successMessage()
      } catch (err) {
        this.reqError = err
      }
      this.block = false
    },

    async successMessage(){
      this.success = true
      setTimeout(()=>{
        this.success = false
      },3000)
    }
  }
}
</script>