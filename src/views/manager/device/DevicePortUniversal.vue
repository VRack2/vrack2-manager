<template>
    <div class="card mt-3">
      <div class="card-header">
        <div class="d-flex align-items-center justify-content-between ">
          <div class="h5 m-0" :class="{ 'my-link': !expand }" @click="toggle()">
            <span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ service }}</span>.<span class="text-secondary">devices</span>.<span class="text-info">{{ device.id }}</span>:
            <span class="text-danger-emphasis">{{ action }}</span>
          </div>
          <div v-if="remove">
              <button class="btn btn-sm btn-danger" @click="remove()"><i class="bi bi-dash-circle-fill"></i></button>
          </div>
        </div>
      </div>
      <div class="card-body" v-if="action" v-show="show">
        <form-view :model="form" :struct="formStruct"></form-view>
        <div class="rounded border p-2 mb-2">
          <h5 class="card-title m-0" style="cursor: pointer;" @click="showStruct = !showStruct">Структура запроса</h5>
          <div class="card-text mt-2" v-if="showStruct">
            <!-- <hr> -->
            <div  v-for="(act, idx) in device.actions[action].requirements" :key="'act-struct' + idx"> 
              <b>{{ idx }}</b> : <ActionStructView  :rule="act"></ActionStructView>
            </div>
          </div>
        </div>
        <div class="rounded border p-2">
          <h5 class="card-title m-0" style="cursor: pointer;" @click="showSend = !showSend">Данные для отправки</h5>
          <p class="card-text" v-if="showSend">
          <pre class="m-0">{{ form }}</pre>
          </p>
        </div>
        <div v-if="reqResult" class="rounded border p-2">
          <h5>Результат выполнения</h5>
          <pre class="m-0">{{ reqResult }}</pre>
        </div>
      </div>
      <div class="card-body" v-if="action && reqError">Ошибка запроса:<ServiceError v-if="reqError" :error="reqError">
        </ServiceError>
      </div>
      <div class="card-footer" v-if="action"  v-show="show">
        <div class="btn-group">
          <button :disabled="block" class="btn btn-primary" @click="sendRequest()">Отправить</button>
        </div>
      </div>
    </div>
  </template>
  <script>
  
  import { inject, ref } from 'vue';
  import ServiceError from '@/components/ServiceError.vue';
  
  export default {
    name: 'ManagerIndexView',
    props: ['port'],
    components: {
      ServiceError
    },
  
    mounted(){
        
    },
  
    setup() {
      const form = ref({})
      const formStruct = ref({ blocks: [] })
      const remote = inject('remote')
      const block = ref(false)
      const reqError = ref(false)
      const reqResult = ref(false)
      const showSend = ref(false)
      const showStruct = ref(false)
      const show = ref(true)
      return {
        form,
        formStruct,
        remote,
        block,
        reqError,
        reqResult,
        showSend,
        showStruct,
        show
      }
    },
  
    methods: {
      toggle(){
        if (this.expand) return
        this.show = !this.show
      },
  
      async sendRequest() {
        this.reqResult = false
        try {
          this.reqResult = await this.remote.command('serviceDeviceAction', {
            service: this.service,
            device: this.device.id,
            action: this.action,
            data: this.form
          })
          this.reqError = false
        } catch (err) {
          this.reqError = err
        }
      },
  
      ruleToForm(fieldName, field) {
        const ret = {
          type: field.type,
          model: fieldName,
          label: fieldName,
          default: field.default,
          description: field.description,
        }
        if (!field.rules || !field.rules.length) return ret
        for (const rule of field.rules) {
          const fs = []
          switch (rule.name) {
            case 'contain':
              ret.contain = this.ruleToForm(fieldName, rule.args)
              break
            case 'fields':
              for (const fn in rule.args) fs.push(this.ruleToForm(fn, rule.args[fn]))
              ret.fields = fs
              break
          }
        }
        return ret
      }
    }
  }
  </script>