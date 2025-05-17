<template>
    <g class="device__">
        <rect :width="toStep(DeviceSVG.portGroupWSteps * 2)" :height="toStep(DeviceSVG.hSteps)" :fill="deviceGrid.colors.body_bg" :x="x" :y="y" class="device__bg"></rect>
        <g class="device__header">
          <rect :width="steps * step" :height="step" :fill="deviceGrid.colors.header_bg" :x="x" :y="y"></rect>
          <text font-size="24" letter-spacing="2" :x=" x + deviceGrid.getStepPercent(30)" :y="y + deviceGrid.getStepPercent(70)" fill="#fff" class="label-for-device">{{ id }}</text>
        </g>
        <template v-for="(group,index) in DeviceSVG.inputs" :key="id + type + 'input-group' + index">
            <PortGroup v-if="group.ports.length" :x="x" :y="y + ((1 + group.started) * step)" :label="index" :steps="steps/2" :ports="group.ports" :second="false"></PortGroup>
        </template>

        <template v-for="(group,index) in DeviceSVG.outputs" :key="id + type + 'output-group' + index">
            <PortGroup v-if="group.ports.length" :x="x + (steps/2) * step" :y="y + ((1 + group.started) * step)" :label="index" :steps="steps/2" :ports="group.ports" :second="true"></PortGroup>
        </template>

        <g class="device__footer">
            <text font-size="18" :x="x + deviceGrid.getStepPercent(30)" :y="toStep(DeviceSVG.hSteps) -  deviceGrid.getStepPercent(30)" fill="#fff5">
                {{ id ? id : "No type" }}
            </text>
        </g>
    </g>
</template>
<script>
import deviceGrid from "@/assets/device-grid.js";
import PortGroup from "./PortGroup.vue";
import { inject } from "vue";
export default {
    name: "SchemePort",
    components: {
        PortGroup
    },
    props: ["x", "y", "steps", 'id', 'type', "inputs", "outputs"],
    data (){


        return { step: deviceGrid.grid.step, toStep: deviceGrid.getRealValue.bind(deviceGrid), deviceGrid}
    },
    setup (){
        const DeviceSVG = inject('DeviceSVG')
        return { DeviceSVG }
    },
};
</script>
<style scoped>
.label-for-device{
  font-weight: 700;
}
</style>