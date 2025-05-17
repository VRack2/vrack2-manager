<template>
    <div class="device-connection-info p-3 container-fluid" v-if="device">
        <DeviceConnections v-if="DeviceSVG.ready" :key="$route.params.device"></DeviceConnections>
        <DeviceInfoWidget :device="device" :key="device.id"></DeviceInfoWidget>
    </div>
</template>
<script>
import { inject, provide, ref } from 'vue';
import DeviceInfoWidget from './DeviceInfoWidget.vue';
import { DeviceSVG } from '@/classes/DeviceSVG';
import DeviceConnections from './svg/DeviceConnections.vue';

export default {
    name: 'DeviceInfoView',
    components: {
        DeviceInfoWidget,
        DeviceConnections
    },
    mounted() {
        this.device = this.structure[this.$route.params.device]
        this.DeviceSVG = new DeviceSVG()
        this.DeviceSVG.setDevice(this.device)
        // this.getDeviceInfo()
    },
    watch: {
        'structure': function () {
        this.device = this.structure[this.$route.params.device]
        this.DeviceSVG = new DeviceSVG()
        this.DeviceSVG.setDevice(this.device)
        // this.getDeviceInfo()
        }
    },
    setup() {
        const device = inject('device')
        const structure = inject('structure')
        const remote = inject('remote')
        const ODeviceSVG = ref(new DeviceSVG())
        provide("DeviceSVG", ODeviceSVG)
        const info = ref(false)
        return { device, structure, remote, info, DeviceSVG: ODeviceSVG }
    },
}
</script>

<style>
.device-connection-info {
    background-color: #545454;
}
</style>