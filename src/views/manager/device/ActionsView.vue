<template>
    <DeviceActionSelect :device="device" :key="device.id"></DeviceActionSelect>
    <div v-if="activeAction" class="alert alert-danger mt-3">
        Форма будет очищена если покините вкладку или выберите другой экшен. <br> 
        Используйте "<b>В консоль</b>" что бы добавить экшен в консоль.
    </div>
    <DeviceActionUniversal v-if="activeAction" :expand="true" :device="device" :service="$route.params.service" :action="activeAction"></DeviceActionUniversal>
    <!-- <DeviceActionWidget :device="device" :key="device.id"></DeviceActionWidget> -->
</template>
<script>
import { inject, provide } from 'vue';
import DeviceActionSelect from './DeviceActionSelect.vue';
// import DeviceActionWidget from './DeviceActionWidget.vue';
import { ref } from 'vue';
import DeviceActionUniversal from './DeviceActionUniversal.vue';

export default {
   name: 'DeviceInfoView',
   components: {
        // DeviceActionWidget,
        DeviceActionSelect,
        DeviceActionUniversal
   },
   setup() {
       const device = inject('device')
       const activeAction = ref(false)
       provide('activeAction', activeAction)
       return { device, activeAction }
   },
}
</script>
<style></style>