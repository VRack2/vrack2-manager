<template>
    <g>
        <path
            :d="`M${params.from_coord.x} ${params.from_coord.y} Q${qx} ${qy} ${params.to_coord.x} ${params.to_coord.y}`"
            :stroke="is_active ? 'red' : params.color ? params.color : '#ccc'"
            :stroke-opacity="is_active ? 1 : 0.5"
            :stroke-width="relationStrokeWidth"
            class="device__relation"
        >
        </path>
        <circle :cx="params.from_coord.x" :cy="params.from_coord.y" :r="r" :stroke-width="strokeWidth" :stroke="params.color"></circle>
        <circle :cx="params.to_coord.x" :cy="params.to_coord.y" :r="r" :stroke-width="strokeWidth" :stroke="params.color"></circle>
    </g>
</template>
<script>
import deviceGrid from "@/assets/device-grid.js";
export default {
    name: "SchemeRelation",
    props: ["params", "is_active", "is_rotated"],
    computed: {
        qy() {
            if (this.is_rotated) {
                if (this.params.from_coord.y > this.params.to_coord.y) {
                    if (this.params.from_coord.y - this.params.to_coord.y > this.$parent.options.grid.step * 2) {
                        return this.params.from_coord.y - (this.params.from_coord.y - this.params.to_coord.y) / 2 + this.$parent.options.grid.step;
                    }
                    return this.params.from_coord.y - (this.params.from_coord.y - this.params.to_coord.y) / 2 + this.$parent.options.grid.step / 4;
                }
                if (this.params.to_coord.y - this.params.from_coord.y > this.$parent.options.grid.step * 2) {
                    return this.params.to_coord.y - (this.params.to_coord.y - this.params.from_coord.y) / 2 + this.$parent.options.grid.step;
                }
                return this.params.to_coord.y - (this.params.to_coord.y - this.params.from_coord.y) / 2 + this.$parent.options.grid.step / 4;
            }
            return this.params.from_coord.y > this.params.to_coord.y ? this.params.from_coord.y : this.params.to_coord.y;
        },
        qx() {
            if (this.params.from_coord.y < this.params.to_coord.y) {
                if (this.params.from_coord.x < this.params.to_coord.x) {
                    return this.params.from_coord.x + (this.params.to_coord.x - this.params.from_coord.x) / 2;
                }
                return this.params.from_coord.x - (this.params.from_coord.x - this.params.to_coord.x) / 2;
            }
            if (this.params.from_coord.x < this.params.to_coord.x) {
                return this.params.from_coord.x + (this.params.to_coord.x - this.params.from_coord.x) / 2;
            }
            return this.params.from_coord.x - (this.params.from_coord.x - this.params.to_coord.x) / 2;
        },
        strokeWidth() {
            return deviceGrid.getStepPercent(10);
        },
        r() {
            return deviceGrid.getStepPercent(18);
        },
        relationStrokeWidth() {
            return deviceGrid.getStepPercent(18);
        },
    },
};
</script>
