<template>
    <g class="device__port-group">
        <rect
            :width="group_width - grid_step / 3"
            :height="group_height - grid_step"
            :fill="colors.group_bg"
            :x="position.x + grid_step / 3"
            rx="10"
            :y="get_group_y()"
        >
        </rect>
        <text :x="padding.left" :y="get_group_y(10) - grid_step / 5" font-size="16" fill="#fff" style="text-transform: uppercase;font-weight:700">
            {{ group.label == "main" ? group.label + " " + group.type : group.label }}
        </text>
        <Port
            v-for="(port, port_index) in group.ports"
            :key="'port_input_' + group.index + '_' + port_index"
            :is_rotated="false"
            :port="getPort(port.label, port_index)"
            :offsetY="position.y"
        ></Port>
    </g>
</template>
<script>
import Port from "./Port.vue";
import deviceGrid from "@/assets/device-grid.js";

export default {
    name: "PortGroup",
    props: ["group", "parent"],
    data() {
        return {};
    },
    components: { Port },
    computed: {
        group_width() {
            return this.parent.dimension.width / 2 - deviceGrid.getStepPercent(10);
        },
        group_height() {
            return this.group.ports.length * this.grid_step + this.grid_step;
        },
        grid_step() {
            return deviceGrid.grid.step;
        },
        colors() {
            return deviceGrid.colors;
        },
        position() {
            let position = Object.assign({}, this.parent.position);
            if (this.group.type == "outputs") {
                position.x = position.x + this.group_width - deviceGrid.getStepPercent(33) / 2;
            }
            let offsetY = 0;
            for (let index = 0; index < Object.keys(this.parent.portGroups).length; index++) {
                const key = Object.keys(this.parent.portGroups)[index];
                if (key != this.group.label) {
                    offsetY += this.parent.portGroups[key].length * this.grid_step + this.grid_step;
                } else {
                    break;
                }
            }
            position.y += offsetY;
            return position;
        },
        padding() {
            return {
                top: this.position.y + deviceGrid.getStepPercent(10) + this.grid_step,
                right: this.position.x + this.group_width - deviceGrid.getStepPercent(50),
                bottom: this.position.y + this.group_height - deviceGrid.getStepPercent(10),
                left: this.position.x + deviceGrid.getStepPercent(50),
            };
        },
    },
    methods: {
        get_group_y() {
            let y = this.grid_step * 2 + this.position.y;
            return y;
        },
        getPort(portLabel, index) {
            let isSecondColumn = this.group.type == "outputs";
            let port = this.parent.device.ports[this.group.type][portLabel];
            const portPosition = {
                x: isSecondColumn ? this.padding.right : this.padding.left + deviceGrid.getStepPercent(25),
                y: this.position.y + this.grid_step * 2 + this.grid_step * index + deviceGrid.getStepPercent(50),
            };

            let isHasRelation = true;
            if (port === null || (Array.isArray(port) && port.length === 0)) isHasRelation = false;

            if (!deviceGrid.port_positions[this.parent.label]) {
                deviceGrid.port_positions[this.parent.label] = {
                    inputs: {},
                    outputs: {},
                };
            }

            if (isSecondColumn) {
                deviceGrid.port_positions[this.parent.label].outputs[portLabel] = portPosition
            } else {
                deviceGrid.port_positions[this.parent.label].inputs[portLabel] = portPosition
            }

            return {
                label: portLabel,
                is_second_column: isSecondColumn,
                label_x: isSecondColumn ? this.padding.right - deviceGrid.getStepPercent(50) : this.padding.left + deviceGrid.getStepPercent(70),
                label_y: portPosition.y + deviceGrid.getStepPercent(10),
                x: portPosition.x,
                y: portPosition.y,
                isHasRelation: isHasRelation,
                transform: this.parent.device.statuses.is_rotated
                    ? isSecondColumn
                        ? `rotate(-90 ${portPosition.x} ${portPosition.y})`
                        : `rotate(90 ${portPosition.x} ${portPosition.y})`
                    : "",
            };
        },
    },
};
</script>
<style lang="less"></style>
