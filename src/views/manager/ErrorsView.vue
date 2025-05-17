<template>
    <div class="container-fluid">
      <div class="card mt-3" v-if="service.errors">
        <div class="card-header">Ошибки сервиса ({{ service.errors  }})</div>
        <div v-for="(serror, idx) in this.serviceErrors" :key="'err'+ idx"><ServiceError :error="serror" :subError="false"></ServiceError></div>
      </div>
    </div>
  </template>
  <script>
  
  import { inject, ref } from 'vue';
  import ServiceError from '@/components/ServiceError.vue';
  
  export default {
    name: 'ManagerIndexView',
    components: { ServiceError },
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
  
    watch: {
      "service.errors": function (){
        this.updateServiceErrors()
      }
    },
  
    mounted(){
      if (this.service && this.service.errors) {
        this.updateServiceErrors()
      }
    },
  
    methods: {
      async updateServiceErrors(){
        this.serviceErrors = await this.remote.command('serviceErrors', { service: this.service.id })
      }
    }
  }
  </script>