<template>
    <g class="device__port-group">
        <text 
            :x="x + (padding * 1.5)" 
            :y="get_group_y() - grid_step / 5" 
            font-size="16" 
            fill="#fff" 
            style="text-transform: uppercase; font-weight: 700;">
            {{ label }} 
        </text>
        <rect
            :width="(grid_step * steps) - (padding * 2)"
            :height="ports.length * grid_step"
            fill="#202020"
            :x="x + padding"
            rx="10"
            :y="get_group_y()"
        >
        </rect>
        <Port
            v-for="(port, port_index) in ports"
            :key="'port_input_' + port_index"
            :x="port.x"
            :y="port.y"
            :label="port.label"
            :second="second"
            :stroke="port.stroke"
        >
        <!-- get_group_y()  + (grid_step * port_index) + grid_step / 2 -->
    </Port>
    </g>
</template>
<script>
import Port from "./Port.vue";
import deviceGrid from "@/assets/device-grid.js";

export default {
    name: "PortGroup",
    props: ['x', 'y', 'label', 'ports', 'second', 'steps'],
    data() {
        return {grid_step: deviceGrid.grid.step, padding: deviceGrid.getStepPercent(20)};
    },

    methods: {
        getPortX(){
            if (!this.second) return this.x + this.padding +  this.padding * 2
            return this.x + this.padding + this.getWidth() -  this.padding * 2
        },
        getWidth(){
            return (this.grid_step * this.steps) - (this.padding * 2)
        },
        get_group_y() {
            let y = this.grid_step * 1 + this.y;
            return y;
        },
    },
    components: { 
        Port 
    },
    computed: {

    }
  
};
</script>
<style>
</style>
