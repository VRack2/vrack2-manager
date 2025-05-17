<template>
     <div v-for="(field, fi) of fields" :key="'f' + fi">         
        <component :is="field.type" :model="form" :field="field"></component>
    </div>
</template>
<script>

import FieldTextView from './FieldTextView.vue'
import FieldSelectView from './FieldSelectView.vue'
import FieldCheckboxView from './FieldCheckboxView.vue'
import FieldTextareaView from './FieldTextareaView.vue'
import FieldNumberView from './FieldNumberView.vue'
import FieldArrayView from './FieldArrayView.vue'
import FieldObjectView from './FieldObjectView.vue'

export default {
    name: 'FormView',
    components: { 
        text: FieldTextView, 
        string: FieldTextView, 
        checkbox: FieldCheckboxView,
        select: FieldSelectView,
        textarea: FieldTextareaView, 
        array: FieldArrayView, 
        number: FieldNumberView, 
        object: FieldObjectView, 
        boolean: FieldCheckboxView, 
    },
    props: ['model', 'fields'],
    data: function () {
        return {
            form: this.model,
        }
    },
}
</script>