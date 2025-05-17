<template>
    <div><b>{{ name }}</b> - <ActionStructView  :rule="rule"></ActionStructView></div>
</template>
<script>

export default {
    name: 'ActionWidget',
    props: ['rule', 'name'],
    setup (){
        return {}
    }
}
</script>