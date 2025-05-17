<template>
    <DeviceActionUniversal v-for="aon of ConsoleWidgets.actionsList" :key="aon.id" :device="aon.deviceStruct" :service="aon.service" :action="aon.action" :remove="() => { remove(aon.id) }"></DeviceActionUniversal>
</template>
<script>

import { inject } from 'vue';
import DeviceActionUniversal from '../device/DeviceActionUniversal.vue';

export default {
    name: 'ChannelsView',
    components: {
        DeviceActionUniversal
    },
    setup() {
        const ConsoleWidgets = inject('ConsoleWidgets')
        return { ConsoleWidgets }
    },
    methods: {
        remove(id) {
            this.ConsoleWidgets.removeAction(id)
        }
    }
}
</script>


<style>

</style>