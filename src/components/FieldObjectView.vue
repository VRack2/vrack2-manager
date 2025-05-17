<template>
    <div class="form-group mb-3">
      <label>{{ field.label }}{}</label>
      <button v-if="field.deleteElement" @click="field.deleteElement()" class="btn btn-danger ms-3 p-0 ps-2 pe-2 btn-sm"><i class="bi bi-node-minus-fill"></i></button>
      <small class="form-text text-muted ms-3">{{ field.description }}</small>
      <!-- <div class="m-3 form-control" v-for="(el, idx) in field.fields" :key="'obj' + idx"> -->
        <!-- {{ el }} -->
          <!-- {{ form }} -->
        <div class="m-3 form-control"> 
          <TestFieldView v-if="form[field.model] !== undefined" :model="form[field.model]" :fields="field.fields"></TestFieldView>
        </div>
      <!-- </div> -->
    </div>
  </template>
  
  <script>
  
  import { toRefs } from 'vue';
  
  export default {
    props: ["field", 'model'],
    components: {  },
    name: 'FieldArrayView',
    mounted (){
      if (this.form[this.field.model] === undefined){
        this.form[this.field.model] = {}
      } 
    },
    setup(props) {
      const { model, field } = toRefs(props)
      if (model[field.model] === undefined) {
        model[field.model] = {}
      }
      return { form: model }
    },
    methods: {
    }
  }
  </script>