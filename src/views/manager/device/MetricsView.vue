<template>
    <MetricsSelectWidget :device="device" :metric="metric" :control="control"></MetricsSelectWidget>
    <MetricsControlWidget :metric="metric" :control="control"></MetricsControlWidget>
    <MetricsGraphWidget :metric="metric" :control="control"> </MetricsGraphWidget>

</template>
<script>
import { inject, ref } from 'vue';

import MetricsControlWidget  from '@/components/MetricsControlWidget.vue';
import { Metrics, MetricsControl } from '@/classes/Metrics'
import MetricsSelectWidget from '@/components/MetricsSelectWidget.vue';
import MetricsGraphWidget from '@/components/MetricsGraphWidget.vue';
export default {
    name: 'DeviceInfoView',
    components: {
        MetricsControlWidget,
        MetricsSelectWidget,
        MetricsGraphWidget,
    },

    setup() {
        const device = inject('device')
        const metricRef = ref( new Metrics())
        const control = ref(new MetricsControl())
       return { device, metric: metricRef, control }
    },

    mounted(){
        this.metric.setService(this.$route.params.service, this.$route.params.device)
        this.control.start()
    },

    unmounted(){
        this.control.stop()
    }
}
</script>
<style></style>