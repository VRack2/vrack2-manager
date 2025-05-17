<template>
    <div class="form-check mb-3" v-if="this.form !== undefined">
        <input v-model="form[field.model]" type="checkbox" class="form-check-input" v-bind:id="field.model" />
        <label class="form-check-label" style="display: block;" v-bind:for="field.model">{{ field.label }}</label>
        <button v-if="field.deleteElement" @click="field.deleteElement()" class="btn btn-danger ms-3 p-0 ps-2 pe-2 btn-sm"><i class="bi bi-node-minus-fill"></i></button>
        <small class="form-text text-muted" v-bind:for="field.model">{{ field.description }}</small>
    </div>
</template>

<script>
export default {
    props: ["model", "field"],
    name: 'FieldCheckboxView',
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