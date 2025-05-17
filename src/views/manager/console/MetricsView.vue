<template>
    <MetricsControlWidget :metric="metric" :control="MetricControl"></MetricsControlWidget>
    <div v-for="metric in ConsoleWidgets.metricList" :key="metric.id">
        <MetricsGraphWidget :metric="metric" :control="MetricControl" :remove="remove"> </MetricsGraphWidget>
    </div>
</template>
<script>
import { inject } from 'vue';

import MetricsControlWidget  from '@/components/MetricsControlWidget.vue';

import MetricsGraphWidget from '@/components/MetricsGraphWidget.vue';
export default {
    name: 'DeviceInfoView',
    components: {
        MetricsControlWidget,
        MetricsGraphWidget,
    },

    setup() {
        const MetricControl = inject('MetricControl')
        const ConsoleWidgets = inject('ConsoleWidgets')
       return { MetricControl, ConsoleWidgets }
    },

    methods: {
        remove(id){
            this.ConsoleWidgets.removeMetric(id)
        }
    }
}
</script>
<style></style>