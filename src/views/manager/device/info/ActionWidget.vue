<template>
    <div>
        <b>{{ name }}</b>  ({{ action.type }}) <template v-if="action.description"> - {{ action.description }}</template>
        <div class="ms-3"  v-for="(act, idx) in action.requirements" :key="'act-struct' + idx"> 
            <b>{{ idx }}</b> : <ActionStructView  :rule="act"></ActionStructView>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ActionWidget',
    props: ['action', 'name'],
    setup (){
        return {}
    }
}
</script>