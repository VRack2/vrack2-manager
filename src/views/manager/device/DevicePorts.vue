<template>
    <DevicePortSelect :device="device" :key="device.id" type="input" caption="Вызов входа"></DevicePortSelect>
    <DevicePortSelect :device="device" :key="device.id" type="output" caption="Захват выхода"></DevicePortSelect>
</template>
<script>
import { inject,  } from 'vue';
import DevicePortSelect from './DevicePortSelect.vue';

export default {
   name: 'DevicePorts',
   components: {
        DevicePortSelect,
   },
   setup() {
       const device = inject('device')
       return { device }
   },
}
</script>
<style></style>