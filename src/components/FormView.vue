<template>

  <div v-if="show">
    <div v-for="(header, hi) of struct.blocks" :key="'hi' + hi">
      <h5 v-if="header.label" >{{ header.label }}</h5>
        <TestFieldView :model="form" :fields="header.fields"></TestFieldView>
    </div>
  </div>
</template>
<script>

import { provide, toRefs } from 'vue'
export default {
  name: 'FormView',
  props: ['model', 'struct'],
  data: function(){
    return {
      form: this.model,
    }
  },

  setup(props){
    const { model } = toRefs(props)
    provide('model', model)
    return { show: true }
  }
}
</script>