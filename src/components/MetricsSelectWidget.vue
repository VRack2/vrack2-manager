<template>
    <div class="card mt-3">
        <div class="card-header d-flex justify-content-start align-items-center">
            Выбор метрик для просмотра 
            <button :disabled="added" class="ms-3 btn btn-sm btn-success" @click="toConsole()">
                <i class="bi bi-plus-circle-fill"></i><template v-if="!added"> В консоль</template>
                <template v-if="added"> Добавлено</template>
            </button>
        </div>
        <div class="card-body">
            <div class="form-check mt-2" v-for="(metric, mname) in device.metrics" :key="'metric' + mname">
                <input class="form-check-input" @change="updateMetricList" v-model="model.metrics[mname]" type="checkbox" value="" :id="mname">
                <label class="form-check-label" :for="mname">
                    {{ mname }}
                </label>
                <label class="ms-2 text-secondary" :for="mname"> {{ metric.description }}</label>
            </div>
        </div>
    </div>
</template>
<script>

import { Metrics } from '@/classes/Metrics';
import { ref,inject  } from 'vue';

export default {
    name: 'MetricsSelectWidget',
    props: ['metric', 'device'],
    components: {},
    setup() {
        const ConsoleWidgets = inject('ConsoleWidgets')
        const model = ref({ metrics: {} })
        const added = ref(false)
        return { model, ConsoleWidgets, added }
    },

    methods: {
        toConsole(){
            const nMetrics = new Metrics()
            nMetrics.import(this.metric)
            if (!nMetrics.metricList.length) return
            const copyEl = ['name', 'service', 'device']
            for (const el of copyEl){ nMetrics[el] = this.metric[el] }
            this.ConsoleWidgets.addMetrics(nMetrics)
            this.added = true
            setTimeout(()=>{ this.added = false }, 2000)
        },

        updateMetricList(){
            this.metric.clearList()
            for (const mname in this.model.metrics){
                if (!this.model.metrics[mname]) continue
                this.metric.addMetric(this.$route.params.service, this.device.id,mname)
            }
        }
    }
}
</script>
<style></style>