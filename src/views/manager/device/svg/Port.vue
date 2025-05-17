<template>
    <g class="device__port">
        <circle :cx="x" :cy="y" :r="r()" :stroke-width="strokeWidth()" :stroke="st()" :fill="fl()"></circle>
        <text :x="lx" :y="ly" font-size="20" :text-anchor="`${second ? 'end' : 'start'}`" fill="#fff">{{ ml }}</text>
    </g>
</template>
<script>
import deviceGrid from "@/assets/device-grid.js";
export default {
    name: "SchemePort",
    props: ["x", "y","second", "label", 'fill', 'stroke'],
    methods: {
        strokeWidth() { return deviceGrid.getStepPercent(10); },
        r() { return deviceGrid.getStepPercent(18); },
        st() { return this.stroke?this.stroke:'#878278'},
        fl (){return this.fill?this.fill:'#000'} 
    }, 
    computed: {
        lx (){
            return this.second? this.x - deviceGrid.getStepPercent(40): this.x + deviceGrid.getStepPercent(40)
        },
        ly (){
            return this.y + deviceGrid.getStepPercent(15)
        },
        ml() {
            return this.label.indexOf(".") >= 0 ? this.label.split(".")[1] : this.label;
        },
    },
};
</script>
