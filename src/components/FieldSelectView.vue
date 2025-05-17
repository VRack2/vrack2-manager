<template>
    <div class="mb-3">
        <label class="form-label">{{ field.label }}</label>
        <button v-if="field.deleteElement" @click="field.deleteElement()" class="btn btn-danger ms-3 p-0 ps-2 pe-2 btn-sm"><i class="bi bi-node-minus-fill"></i></button>
        <select  :disabled="block" v-model="form[field.model]" class="form-select">
            <option v-for="(sr, idx) in options" :value="idx" :key="idx">{{ sr }}</option>
        </select>
        <small class="form-text text-muted" v-bind:for="field.model">{{ field.description }}</small>
    </div>
</template>
  
<script>
import { inject,ref } from 'vue'

export default {
    props: ["model", "field"],
    name: 'FieldSelectView',
    setup(){
        const request = inject('request')
        const block = ref(false)
        const options = ref({})
        return {request, block, options}
    },
    mounted(){
        if (this.model[this.field.model] === undefined){
            this.form[this.field.model] = this.field.default
        }
        this.options = this.field.options
        if (this.field.update) this.iupdate()
    },

    methods: {
        async iupdate(){
            this.block = true
            this.options = await this.request('get', this.field.update)
            this.block = false
        }
    },
    data: function (){
        return {
            form: this.model
        }
    }
}
</script>
  