<template>
  <div class="form-group">
    <div class="m-2">
      <label>{{ field.label }}[<span v-if="field.index !== undefined">{{ field.index }}</span>]</label>
      <button v-if="field.deleteElement" @click="field.deleteElement()" class="btn btn-danger ms-3 p-0 ps-2 pe-2 btn-sm"><i class="bi bi-node-minus-fill"></i></button>
      <button v-if="field.contain" @click="addElement()" class="btn btn-success p-0 ms-3  me-3 ps-2 pe-2 btn-sm"><i class="bi bi-node-plus-fill"></i></button>
      <small class="form-text text-muted">{{ field.description }}</small>
    </div>
    <div class="ms-4 p-2" v-for="(el, idx) in this.form[this.field.model]" :key="'el' + idx">
      <TestFieldView :model="form[this.field.model]" :fields="getForm(idx)"></TestFieldView>
    </div>
  </div>
</template>

<script>

import { toRefs } from 'vue';

export default {
  props: ["field", 'model'],
  components: {  },
  name: 'FieldArrayView',
  setup(props) {
    const { model, field } = toRefs(props)
    if (model[field.model] === undefined) {
      model[field.model] = []
    }
    return { form: model }
  },
  data: function () {
    return {
      // elements: []
    }
  },
  methods: {
    getForm(idx){
      const field = JSON.parse(JSON.stringify(this.field))
      field.contain.model = idx
      if (this.field.index !== undefined) field.contain.label += '[' + this.field.index +']'
      field.contain.index = idx
      field.contain.deleteElement = ()=>{ this.deleteElement(idx) }
      return  [ field.contain ]
    },
    addElement() {

      if (this.form[this.field.model] === undefined) this.form[this.field.model] = []
      this.form[this.field.model].push(this.field.default)

    },
    deleteElement(idx){
      this.form[this.field.model].splice(idx, 1)
    }
  }
}
</script>