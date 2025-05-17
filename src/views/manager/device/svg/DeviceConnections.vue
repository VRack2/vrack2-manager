<template>
    <svg :width="toStep(DeviceSVG.wSteps)" :height="toStep(DeviceSVG.hSteps)">
        <!-- <rect :width="toStep(DeviceSVG.wSteps)" :height="toStep(DeviceSVG.hSteps)" fill="#545454"></rect> -->
        <template v-for="(group,index) in DeviceSVG.leftConnections" :key="id + type + 'input---group' + index">
            <rect :width="toStep(DeviceSVG.portGroupWSteps)" :height="toStep(group.steps)" :fill="deviceGrid.colors.body_bg" :x="0" :y="toStep(group.started) + DeviceSVG.groupPadding" class="device__bg"></rect>
            <PortGroup v-if="group.ports.length" :x="0" :y="toStep(group.started)" :label="index" :steps="4" :ports="group.ports" :second="true"></PortGroup>
        </template>
        <device v-if="DeviceSVG.ready" :steps="8" :x="toStep(DeviceSVG.portGroupWSteps) + toStep(DeviceSVG.deviceIntervalSteps)" :y="0" :id="DeviceSVG.device.id" :inputs="[]" :outputs="[]"></device>

        <template v-for="(group,index) in DeviceSVG.rightConnections" :key="id + type + 'input-r-group' + index">
            <rect :width="toStep(DeviceSVG.portGroupWSteps)" :height="toStep(group.steps)" :fill="deviceGrid.colors.body_bg" :x="toStep(DeviceSVG.portGroupWSteps * 3) + toStep(DeviceSVG.deviceIntervalSteps * 2)" :y="toStep(group.started) + DeviceSVG.groupPadding" class="device__bg"></rect>
            <PortGroup v-if="group.ports.length" :x="toStep(DeviceSVG.portGroupWSteps * 3) + toStep(DeviceSVG.deviceIntervalSteps * 2)" :y="toStep(group.started)" :label="index" :steps="4" :ports="group.ports" :second="false"></PortGroup>
        </template>


        <g v-for="(rel,inx) of DeviceSVG.relation" :key="'relleft' + inx">
            <path
            :d="`M${rel.fromX} ${rel.fromY} Q${qx(rel.fromX,rel.fromY, rel.toX,rel.toY)} ${qy(rel.fromX,rel.fromY, rel.toX,rel.toY)} ${rel.toX} ${rel.toY}`"
            :stroke="rel.color"
            :stroke-opacity="0.5"
            :stroke-width="deviceGrid.getStepPercent(18)"
            fill = "none"
            >
            </path>
            <circle :cx="rel.fromX" :cy="rel.fromY" :r="DeviceSVG.radius" :stroke-width="deviceGrid.getStepPercent(10)" :stroke="rel.color"></circle>
            <circle :cx="rel.toX" :cy="rel.toY" :r="DeviceSVG.radius" :stroke-width="deviceGrid.getStepPercent(10)" :stroke="rel.color"></circle>
        </g>
    </svg>
</template>
<script>
import { inject } from 'vue';

import deviceGrid from "@/assets/device-grid.js";
import Device from './Device.vue';
import PortGroup from "./PortGroup.vue";

export default {
    name: "DeviceConnections",
    components: {
        PortGroup,
        Device
    },
    props: [],
    setup() {
        const DeviceSVG = inject('DeviceSVG')
        return { DeviceSVG, deviceGrid, step: deviceGrid.grid.step, toStep: deviceGrid.getRealValue.bind(deviceGrid) }
    },
    methods: {
        qy(fx,fy,tx,ty){  return fy > ty ? fy : ty; },
        qx(fx,fy,tx,ty){
            if (fy < ty){
                if (fx < tx) return fx + (tx - fx) / 2
                return fx - (fx - tx) /2
            }
            if (fx < tx) return fx + (tx - fx) / 2
            return fx - (fx - tx)/2
        }
    }
};
</script>
<style scoped>
.label-for-device{
  font-weight: 700;
}
</style>