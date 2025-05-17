<template>
    <div class="form-group mb-3">
        <label>{{ field.label }}</label>
        <button v-if="field.deleteElement" @click="field.deleteElement()" class="btn btn-danger ms-3 p-0 ps-2 pe-2 btn-sm"><i class="bi bi-node-minus-fill"></i></button>
        <textarea
            v-model="form[field.model]"
            v-bind:type="field.type"
            class="form-control"
            rows="5"
        />
        <small class="form-text text-muted">{{ field.description }}</small>
    </div>
</template>
  
<script>
export default {
    props: ["model", "field"],
    name: 'FieldTextareaView',
    mounted(){
        if (this.model[this.field.model] === undefined){
            this.form[this.field.model] = this.field.default
        }
    },
    data: function (){
        return {
            form: this.model
        }
    }
}
</script>
  