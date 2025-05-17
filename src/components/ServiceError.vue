<template>
  <div class="alert p-1 alert-light rounded-0 border-0 border-bottom">
    <div class="d-flex  justify-content-between  align-items-center">
        <div v-if="error.vError" class="p-2">
          {{ error.name }} - 
          <span class="text-warning"><b>{{ error.vShort }}</b></span>
           ({{ error.vCode }}) 
           <span v-if="error.vAddErrors && error.vAddErrors.length" class="badge text-bg-danger">SUB ERRORS {{ error.vAddErrors.length }}</span>
           <span v-if="error.message">: {{ error.message }}</span>
        </div>
        <div v-if="!error.vError">Error: {{ error.message }}</div>
        <button class="btn btn-light btn-sm" v-if="!subError" @click="toggleSpoiler()">Развернуть</button>
    </div>
    <div v-if="spoiler">
      <div v-if="error.vError" class="p-3">
        <div v-for="(key, kidx) in error.vAdd" :key="'erKey' + kidx">
          {{ key }}:
          <pre class="border rounded p-1 mt-1 bg-dark">{{ error[key] }}</pre>
        </div>

        <div v-for="(subError, index ) in error.vAddErrors" :key="'subError' + index">
          <ServiceError :error="subError" :subError="true" ></ServiceError>
        </div>
      </div>
      <div v-if="error.stack"> 
          Stack:
          <pre class="border rounded p-1 mt-1 bg-dark" style="white-space:pre-wrap;">{{ error.stack }}</pre>
      </div>
      <button class="btn btn-light btn-sm" v-if="!subError" @click="toggleAll()">Полный вывод</button>
      <pre v-if="!subError && all" class="border rounded p-1 mt-1 bg-dark" style="white-space:pre-wrap;">{{ error }}</pre>
    </div>
  </div>
</template>

<script>

import ServiceError from '@/components/ServiceError.vue';


export default {
  name: "ServiceError",
  props: ['error' , 'subError'],
  components: { ServiceError },
  data: function () {
    return { spoiler: this.subError, all: false }
  },
  methods: {
    toggleSpoiler() {
      this.spoiler = !this.spoiler
    },
    toggleAll(){
      this.all = !this.all
    }
  }
};
</script>