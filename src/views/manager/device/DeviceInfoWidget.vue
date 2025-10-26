<template>
    <div class="card mt-3">
        <div class="card-body" v-if="errorShow">
            <h2><span class="text-primary-emphasis">{{ acts[0] }}</span>.<span class="text-info">{{ acts[1] }}</span></h2>
        </div>
        <div v-if="errorShow">
            <div class="card-body"><h4>Ошибка получения информации об устройстве</h4></div>
            <ServiceError :error="errorShow"></ServiceError>
        </div>

        <div class="card-body" v-if="!errorShow">
            <h2><span class="text-primary-emphasis">{{ acts[0] }}</span>.<span class="text-info">{{ acts[1] }}</span></h2>
            <div v-if="info.description" v-html="Marked.parse(info.description)" ></div>
            <template v-if="info.inputs && Object.keys(info.inputs).length"><hr>
                <h4 class="mt-4"><i class="ms-2 me-2 bi bi-box-arrow-in-right"></i> Входы</h4>
                <div class="ms-3"><PortWidget v-for="(port, idx) in info.inputs" :key="'itp' + idx" :name="idx" :port="port"></PortWidget></div>
            </template>
            <template  v-if="info.outputs && Object.keys(info.outputs).length"><hr>
                <h4 class="mt-4"><i class="ms-2 me-2 bi bi-box-arrow-right"></i> Выходы</h4>
                <div class="ms-3"><PortWidget v-for="(port, idx) in info.outputs" :key="'otp' + idx" :name="idx" :port="port"></PortWidget></div>
            </template>
            <template v-if="info.actions && Object.keys(info.actions).length"><hr>
                <h4 class="mt-4"><i class="ms-2 me-2 bi bi-arrow-down-up"></i> Экшены</h4>
                <ActionWidget v-for="(actiom, idx) in info.actions" :key="'act' + idx" :name="idx" :action="actiom"></ActionWidget>
            </template>
            <template v-if="info.metrics && Object.keys(info.metrics).length"><hr>
                <h4 class="mt-4"><i class="ms-2 me-2 bi bi-graph-up"></i>Метрики</h4>
                <MetricWidget v-for="(metric, idx) in info.metrics" :key="'mtc' + idx" :name="idx" :metric="metric"></MetricWidget>
            </template>
            <template v-if="info.options && Object.keys(info.options).length"><hr>
            <h4 class="mt-4"><i class="ms-2 me-2 bi bi-menu-button-wide"></i>  Опции</h4>
            <OptionWidget v-for="(rule, idx) in info.options" :key="'opt' + idx" :name="idx" :rule="rule"></OptionWidget>
            </template>
        </div>
    </div>
</template>
<script>

import { inject, ref } from 'vue';
import PortWidget from './info/PortWidget.vue';
import MetricWidget from './info/MetricWidget.vue';
import ActionWidget from './info/ActionWidget.vue';
import OptionWidget from './info/OptionWidget.vue';
import ServiceError from '@/components/ServiceError.vue';
  
import Utility from '@/classes/Utility';

export default {
    name: 'DeviceInfoWidget',
    props: ['device'],
    components: {PortWidget, MetricWidget, ActionWidget, OptionWidget, ServiceError},

    mounted() {
        this.getDeviceInfo()
    },

    setup() {
        const remote = inject('remote')
        const info = ref(false)
        const acts = ref([])
        const errorShow = ref(false)
        const Marked = inject('Marked')
        // const marked = new Marked(
        // markedHighlight({
        //     emptyLangClass: 'hljs',
        //     langPrefix: 'hljs language-',
        //     highlight(code, lang) {
        //     const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        //     return hljs.highlight(code, { language }).value;
        //     }
        // }))

        return { remote, info, Utility, acts, errorShow, Marked }
    },

    methods: {
        async getDeviceInfo() {
            if (!this.device) return
            this.acts = this.device.type.split('.')
            try {
                this.info = await this.remote.command('vendorDeviceInfo', {
                    vendor: this.acts[0],
                    device: this.acts[1]
                })
            }catch (error){
                this.errorShow = error
            }
        }
    }
}
</script>

<style>

</style>