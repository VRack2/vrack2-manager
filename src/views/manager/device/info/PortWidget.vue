<template>
    <div class="mt-2 mb-2">
    <img v-if="port.type === 'standart'" :src="dots" width="24" height="24"> 
    <img v-if="port.type === 'return'" :src="dotr" width="24" height="24"> 
    <b class="ms-2">{{ name }}<template v-if="port.required">*</template></b><template v-if="port.dynamic">[0]</template> ({{ port.type }}) <template v-if="port.description"> - {{ port.description }}</template>
        <div  class="ms-2" v-if="port.requirement">Требования к данным: <ActionStructView  :rule="port.requirement"></ActionStructView></div>
    </div>
</template>
<script>
import dots from "@/assets/standart.svg"
import dotr from "@/assets/return.svg"

export default {
    name: 'DeviceInfoWidget',
    props: ['port', 'name'],
    setup (){
        return {dots, dotr}
    }
}
</script>