<template>
    <b>{{ name }}</b> <small>[{{ metric.interval }}]</small> ({{ metric.retentions }}) time:<i>{{ metric.tType }}</i>  value:<i>{{ metric.vType }}</i> <template v-if="metric.description"> - {{ metric.description }}</template>
</template>
<script>
import dots from "@/assets/standart.svg"
import dotr from "@/assets/return.svg"

export default {
    name: 'DeviceInfoWidget',
    props: ['metric', 'name'],
    setup (){
        return {dots, dotr}
    }
}
</script>