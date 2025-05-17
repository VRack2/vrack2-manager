<template>
    <g :class="device.class">
        <rect :width="dimension.width" :height="dimension.height" :fill="device.color.body_bg" :x="position.x" :y="position.y" class="device__bg"></rect>
        <g class="device__header">
            <rect :width="dimension.width" :height="grid_step" :fill="device.color.header_bg" :x="position.x" :y="position.y"> </rect>
            <text
                @click="toggle_active()"
                font-size="28"
                letter-spacing="2"
                :x="padding.left + $parent.getStepPercent(25)"
                :y="padding.top + $parent.getStepPercent(60)"
                class="device__label"
                fill="#fff"
                >{{ label }}</text
            >
        </g>
        <g class="device__inputs" v-if="port_groups.inputs">
            <!-- make group component and dance from it -->
            <PortGroup
                v-for="(ports, groupLabel, index) in port_groups.inputs"
                :key="'input_group_' + index"
                :group="{ ports: ports, label: groupLabel, index: index, type: 'inputs' }"
                :parent="{ position: position, dimension: dimension, device: device, portGroups: port_groups.inputs, label: label }"
            />
        </g>
        <g class="device__outputs" v-if="port_groups.outputs">
            <PortGroup
                v-for="(ports, groupLabel, index) in port_groups.outputs"
                :key="'input_group_' + index"
                :group="{ ports: ports, label: groupLabel, index: index, type: 'outputs' }"
                :parent="{ position: position, dimension: dimension, device: device, portGroups: port_groups.outputs, label: label }"
            />
        </g>
        <g class="device__footer">
            <text
                font-size="18"
                :x="padding.left + $parent.getStepPercent(20)"
                :y="padding.bottom - $parent.getStepPercent(25)"
                class="device__type"
                fill="#fff5"
                >{{ device.type ? device.type : "No type" }}</text
            >
        </g>
    </g>
</template>
<script>
import { nextTick } from 'vue'
import PortGroup from "./PortGroup.vue";
import { SVG } from "@svgdotjs/svg.js";
import deviceGrid from "@/assets/device-grid.js";
import "@svgdotjs/svg.draggable.js";
export default {
    name: "SchemeDevice",
    components: {
        PortGroup,
    },
    data: function() {
        return {
            timer: null,
            position: this.device.position,
            port_groups: {},
        };
    },
    props: ["device", "label", "index"],
    computed: {
        dimension() {
            const height = Math.max(
                Object.keys(this.device.ports.inputs).length * this.grid_step,
                Object.keys(this.device.ports.outputs).length * this.grid_step
            );
            const groups_count = Math.max(
                Object.keys(this.port_groups.inputs ? this.port_groups.inputs : []).length,
                Object.keys(this.port_groups.outputs ? this.port_groups.outputs : []).length
            );
            return {
                width: deviceGrid.getRealValue(7),
                height: deviceGrid.getSnapValue(height + this.grid_step * groups_count, true) + this.grid_step * 2,
                snap_width: 7,
                snap_height: (deviceGrid.getSnapValue(height + this.grid_step, true) + this.grid_step) / this.grid_step,
            };
        },
        grid_step() {
            return deviceGrid.grid.step;
        },
        padding() {
            return {
                top: this.position.y + this.$parent.getStepPercent(10),
                right: this.position.x + this.dimension.width - this.$parent.getStepPercent(10),
                bottom: this.position.y + this.dimension.height - this.$parent.getStepPercent(10),
                left: this.position.x + this.$parent.getStepPercent(10),
            };
        },
    },
    item: {
        device() {
            this.$emit("update");
        },
        deep: true,
    },
    methods: {
        get_group_offset(group_index, groups) {
            let group_offset = 0;
            let index = 0;
            for (const key in groups) {
                ++index;
                if (Object.hasOwnProperty.call(groups, key)) {
                    const element = groups[key];
                    if (index <= group_index) {
                        group_offset += element.length;
                    }
                }
            }
            return group_offset;
        },
        // rotate() {
        //     this.$set(this.$parent.device_rotations, this.label, !this.$parent.device_rotations[this.label]);
        //     Vue.nextTick().then(() => {
        //         this.$parent.getDeviceRelations(this.label);
        //     });
        // },
        toggle_active() {
            // this.$set(this.$parent.device_selection, this.label, !this.$parent.device_selection[this.label]);
            this.$parent.device_selection[this.label] = !this.$parent.device_selection[this.label]
            this.$parent.getDeviceRelations(this.label);
        },
        updatePosition(x, y, isSnap) {
            if (isSnap) {
                this.position['x'] = x
                this.position['y'] = y
                // this.$set(this.position, "x", x);
                // this.$set(this.position, "y", y);
                nextTick()
                    .then(() => {
                        this.position['x'] = this.$parent.getSnapValue(x)
                        this.position['y'] = this.$parent.getSnapValue(y)
                        // this.$set(this.position, "x", this.$parent.getSnapValue(x));
                        // this.(this.position, "y", this.$parent.getSnapValue(y));
                        this.$parent.preparedDevices[this.label] = this.device
                        // this.$set(this.$parent.preparedDevices, this.label, this.device);
                        return nextTick();
                    })
                    .then(() => {
                        var cor = this.$parent.getGridIndex(this.position.x, this.position.y);
                        this.$parent.devices[this.label].display.row = cor.row;
                        this.$parent.devices[this.label].display.col = cor.col;
                        this.$parent.getDeviceRelations(this.label);
                    });
            } else {
                if (this.timer) return;
                this.timer = setTimeout(() => {
                    this.timer = null;
                }, 10);

                this.position['x'] = x
                this.position['y'] = y
                
                nextTick().then(() => {
                    this.$parent.getDeviceRelations(this.label);
                });
            }
        },
    },
    mounted() {
        const ports = {
            inputs: {
                main: [],
            },
            outputs: {
                main: [],
            },
        };

        let port_index = 0;
        for (const portLabel in this.device.ports.inputs) {
            if (portLabel.indexOf(".") >= 0) {
                const group_name = portLabel.split(".")[0];
                if (ports.inputs[group_name]) {
                    ports.inputs[group_name].push({ label: portLabel, index: port_index++, type: "input" });
                } else {
                    port_index = 0;
                    ports.inputs[group_name] = [{ label: portLabel, index: 0, type: "input" }];
                }
            } else {
                ports.inputs.main.push({ label: portLabel, index: port_index++, type: "input" });
            }
        }
        port_index = 0;
        for (const portLabel in this.device.ports.outputs) {
            if (portLabel.indexOf(".") + 1) {
                const group_name = portLabel.split(".")[0];
                if (ports.outputs[group_name]) {
                    ports.outputs[group_name].push({ label: portLabel, index: port_index++, type: "output" });
                } else {
                    port_index = 0;
                    ports.outputs[group_name] = [{ label: portLabel, index: 0, type: "output" }];
                }
            } else {
                ports.outputs.main.push({ label: portLabel, index: port_index++, type: "output" });
            }
        }
        if (ports.inputs.main.length == 0) delete ports.inputs.main;
        if (ports.outputs.main.length == 0) delete ports.outputs.main;

        this.port_groups = ports;

        SVG(`g.device--${this.index}`)
            .draggable()
            .on("dragmove", (e) => {
                this.updatePosition(e.detail.box.x, e.detail.box.y, false);
            })
            .on("dragend", (e) => {
                this.updatePosition(e.detail.box.x, e.detail.box.y, true);
            });
        this.$emit("update:dimension", this.dimension);
    },
};
</script>
<style lang="less">
.device {
    &__label {
        font-weight: 700;
        cursor: pointer;
        &:hover {
            fill: red;
        }
    }
    &__rotate {
        cursor: pointer;
        &:hover {
            path {
                fill: red;
            }
        }
    }
}
</style>
