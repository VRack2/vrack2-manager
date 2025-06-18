<template>
    <component :is="getCompName(aon.type)" v-for="aon of ConsoleWidgets.portList" :key="aon.id" :port="aon"></component>
</template>
<script>

import { inject } from 'vue';

import DevicePortInputWidget from '../device/DevicePortInputWidget.vue';
import DevicePortOutputWidget from '../device/DevicePortOutputWidget.vue';

export default {
    name: 'ChannelsView',
    components: {
        DevicePortInputWidget,
        DevicePortOutputWidget
    },
    setup() {
        const ConsoleWidgets = inject('ConsoleWidgets')
        return { ConsoleWidgets }
    },
    methods: {
        remove(id) {
            this.ConsoleWidgets.removeAction(id)
        },
        getCompName(type){
            if (type === 'input') return 'DevicePortInputWidget'
            else return 'DevicePortOutputWidget'
        }
    }
}
</script>


<style>

</style>