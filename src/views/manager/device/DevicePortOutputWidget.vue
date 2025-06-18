<template>
    <div class="card mt-3">
      <div class="card-header">
        <div class="d-flex align-items-center justify-content-between ">
          <div class="h5 m-0" :class="{ 'my-link': !expand }" @click="toggle()">
            <span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ port.service }}</span>.<span class="text-secondary">devices</span>.<span class="text-info">{{port.device }}</span>.<span class="text-secondary">outputs</span>.<span class="text-danger-emphasis">{{ port.port }}</span>
          </div>
          <div>
              <div>
                <button :class="{active: repeat}" @click="toCapture()" class="btn btn-sm btn-primary me-2"><i class="bi bi-play"></i></button>
                <button class="btn btn-sm btn-danger" @click="remove()"><i class="bi bi-dash-circle-fill"></i></button>
              </div>
          </div>
        </div>
      </div>
      <LoaderProgress :animated="capture"></LoaderProgress>
      <!-- {{ port }} -->
      <div v-show="show && reqResult">
        <div class="m-2">
          Последний захват: {{ moment(timestamp).format('HH:mm:ss') }}
        </div>
        <div v-if="reqResult" class="m-0">
          <pre class="m-0 console-pre" v-html="reqResult"></pre>
        </div>
      </div>
      <div class="card-body" v-if="reqError">
        Ошибка запроса:
        <ServiceError v-if="reqError" :error="reqError"></ServiceError>
      </div>
    </div>
  </template>
  <script>
  
  import { inject, ref } from 'vue';
  import ServiceError from '@/components/ServiceError.vue';
import LoaderProgress from '@/components/LoaderProgress.vue';
import Convert from 'ansi-to-html'
import moment from 'moment';

moment.locale('ru')

  export default {
    name: 'ManagerIndexView',
    props: ['port'],
    components: {
      ServiceError,
      LoaderProgress
    },
  
    mounted(){
        
    },
  
    setup() {
      const remote = inject('remote')
      const ConsoleWidgets = inject('ConsoleWidgets')
      const reqError = ref(false)
      const reqResult = ref(false)
      const show = ref(true)
      const repeat = ref(false)
      const capture = ref(false)
      const timestamp = ref(0)
      return {
        remote,
        reqError,
        reqResult,
        show,
        repeat,
        capture,
        ConsoleWidgets,
        timestamp,
        Converter: new Convert(),
        moment
      }
    },
  
    methods: {
      toggle(){
        this.show = !this.show
      },

      remove(){
        this.repeat = false
        this.ConsoleWidgets.removePort(this.port.id);
      },

      toCapture(){
        this.repeat = !this.repeat
        if (!this.capture && this.repeat) this.sendRequest()
      },
    
      async sendRequest() {
        if (this.capture) return
        this.capture = true
        try {
          const res = await this.remote.command('serviceDeviceOutputListen', {
            service: this.port.service,
            device: this.port.device,
            port: this.port.port,
            timeout: 4000
          })
          this.reqResult = this.Converter.toHtml(res)
          this.show = true
          this.timestamp = Date.now()
          this.reqError = false
          this.repeat = false
        } catch (err) {
          if (!err.vShort || err.vShort !== "SERVICE_CAPTURE_PORT_TIMEOUT") { 
            this.reqError = err
            this.repeat = false
          }
        }
        this.capture = false
        if (this.repeat) this.sendRequest()
      },
    }
  }
  </script>