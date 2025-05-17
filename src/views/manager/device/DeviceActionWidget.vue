<template>
  <div class="card mt-3">
    <div class="card-header">Device Actions</div>
    <div class="card-body">
      <select class="form-select" v-model="action">
        <option value=""></option>
        <option v-for="(pm, aname) in device.actions" :key="'action-' + aname" :value="aname">{{ aname }} ({{
          pm.description }})</option>
      </select>
    </div>
    <div class="card-body" v-if="action">
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
    <div class="card-footer" v-if="action">
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
  props: ['device'],
  components: {
    ServiceError
  },
  watch: {
    action() {
      this.form = {}
      this.formStruct.blocks = []
      this.reqError = false
      this.reqResult = false
      if (!this.action) return
      const fields = []

      for (const field in this.device.actions[this.action].requirements) {
        fields.push(this.ruleToForm(field, this.device.actions[this.action].requirements[field]))
      }

      this.formStruct.blocks = [{
        label: this.device.actions[this.action].description ? this.device.actions[this.action].description : 'Параметры запроса',
        fields
      }]

      this.ld = localStorage.getItem(this.makeName())
    }
  },

  setup() {
    const form = ref({})
    const formStruct = ref({ blocks: [] })
    const action = ref(false)
    const structure = inject('structure')
    const remote = inject('remote')
    const block = ref(false)
    const reqError = ref(false)
    const reqResult = ref(false)
    const ld = ref(false)
    const showSend = ref(false)
    const showStruct = ref(false)
    return {
      form,
      action,
      structure,
      formStruct,
      remote,
      block,
      reqError,
      reqResult,
      ld,
      showSend,
      showStruct
    }
  },

  methods: {
    async sendRequest() {
      this.reqResult = false
      try {
        this.reqResult = await this.remote.command('serviceDeviceAction', {
          service: this.$route.params.service,
          device: this.device.id,
          action: this.action,
          data: this.form
        })
        this.reqError = false
      } catch (err) {
        this.reqError = err
      }
    },

    load() {
      this.block = true
      setTimeout(() => { this.block = false }, 1000)
      Object.assign(this.form, JSON.parse(localStorage.getItem(this.makeName())))
    },

    save() {
      this.block = true
      setTimeout(() => { this.block = false }, 1000)
      localStorage.setItem(this.makeName(), JSON.stringify(this.form))
      this.updateLd()
    },

    updateLd() {
      this.ld = localStorage.getItem(this.makeName())
    },

    makeName() {
      const p = [
        this.$route.params.service,
        this.$route.params.device,
        this.action
      ]
      return p.join('.')
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