<template>
    <g class="device__port">
        <circle :cx="port.x" :cy="port.y" :r="r" :stroke-width="strokeWidth" stroke="#878278" v-if="!port.isHasRelation"></circle>
        <text
            :x="port.label_x"
            :y="port.label_y"
            font-size="20"
            :style="is_rotated ? 'writing-mode: tb;' : ''"
            :text-anchor="`${port.is_second_column ? 'end' : 'start'}`"
            fill="#fff"
            >{{ label }}</text
        >
    </g>
</template>
<script>
import deviceGrid from "@/assets/device-grid.js";
export default {
    name: "SchemePort",
    props: ["port", "is_rotated", "offsetY"],
    computed: {
        label() {
            return this.port.label.indexOf(".") >= 0 ? this.port.label.split(".")[1] : this.port.label;
        },
        strokeWidth() {
            return deviceGrid.getStepPercent(10);
        },
        r() {
            return deviceGrid.getStepPercent(18);
        },
    },
};
</script>
