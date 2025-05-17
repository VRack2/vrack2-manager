<template>
    <div style="position: relative;" id="body">
        <div class="buttons">
            <div class="btn-group" role="group">
                <button type="button" @click="refresh()"  class="btn btn-dark">Refresh</button>
                <!-- {{ actions }} -->
                <button type="button" class="btn btn-dark" v-for="action in actions" :key="'ab-' + action.caption" @click="action.action(devices)">{{ action.caption }}</button>
                <!-- <button type="button" @click="save()" class="btn btn-dark">Save</button> -->
            </div>
            <!-- <el-button-group>
                <el-button @click="refresh" size="small">Refresh</el-button>
                <el-button @click="save" size="small">Save</el-button>
            </el-button-group> -->
        </div>

        <svg
            id="grid"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            :width="options.size.width"
            :height="options.size.height"
            :viewBox="options.size.viewBox"
        >
            <defs>
                <pattern id="linesX" height="1" width="12.5" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="5.5" y2="0" stroke-width="2" stroke="#404040" />
                </pattern>
                <pattern id="linesY" height="12.5" width="1" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="5.5" stroke-width="2" stroke="#404040" />
                </pattern>
            </defs>
            <g class="grid-group"></g>
            <g class="devices-group">
                <template v-for="(device, deviceLabel, index) in preparedDevices">
                    <Device
                        :label="deviceLabel"
                        :device="device"
                        :index="index"
                        :key="index"
                        v-if="!device_rotations[deviceLabel]"
                        @update:dimension="preparedDevices[deviceLabel].dimension = $event"
                        @update="arrangeDevices()"
                    ></Device>
                </template>
            </g>
            <g class="device-relations">
                <Relation
                    v-for="(relation, portLabel, index) in relations"
                    :key="index"
                    :params="relation"
                    :is_rotated="device_rotations[relation.from_device] || device_rotations[relation.to_device]"
                    :is_active="device_selection[relation.from_device] || device_selection[relation.to_device]"
                ></Relation>
            </g>
        </svg>
    </div>
</template>
<script>
// import Vue from 'vue'
import Device from "./Device.vue";
import Relation from "./Relation.vue";
import { SVG } from "@svgdotjs/svg.js";
import deviceGrid from "@/assets/device-grid.js";
// import '@svgdotjs/svg.draggable.js'
import "@svgdotjs/svg.panzoom.js";
// const devices = require('./test.json')

export default {
    name: "App",
    props: ["devices", "actions"],
    components: {
        Device,
        Relation,
    },
    data() {
        return {
            preparedDevices: {},
            relations: {},
            // devices: devices,
            device_rotations: {},
            device_selection: {},
            port_positions: {},
            inited: false,
            options: {
                size: {
                    width: 0,
                    height: 0,
                },
                viewBox: "0 0 0 0",
                grid: {
                    step: 50,
                    color: "#fff",
                    last_column: 0,
                    row: 1,
                    col: 1,
                    edge_device_index: 0,
                    devices_at_row_count: 0,
                },
                colors_arr: [
                    "#FF6633",
                    "#FFB399",
                    "#FF33FF",
                    "#FFFF99",
                    "#00B3E6",
                    "#E6B333",
                    "#3366E6",
                    "#999966",
                    "#99FF99",
                    "#B34D4D",
                    "#80B300",
                    "#809900",
                    "#E6B3B3",
                    "#6680B3",
                    "#66991A",
                    "#FF99E6",
                    "#CCFF1A",
                    "#FF1A66",
                    "#E6331A",
                    "#33FFCC",
                    "#66994D",
                    "#B366CC",
                    "#4D8000",
                    "#B33300",
                    "#CC80CC",
                    "#66664D",
                    "#991AFF",
                    "#E666FF",
                    "#4DB3FF",
                    "#1AB399",
                    "#E666B3",
                    "#33991A",
                    "#CC9999",
                    "#B3B31A",
                    "#00E680",
                    "#4D8066",
                    "#809980",
                    "#E6FF80",
                    "#1AFF33",
                    "#999933",
                    "#FF3380",
                    "#CCCC00",
                    "#66E64D",
                    "#4D80CC",
                    "#9900B3",
                    "#E64D66",
                    "#4DB380",
                    "#FF4D4D",
                    "#99E6E6",
                    "#6666FF",
                ],
            },
        };
    },
    computed: {
        columnCount() {
            return this.getSnapValue(this.options.size.width) / this.options.grid.step;
        },
        rowCount() {
            return this.getSnapValue(this.options.size.height) / this.options.grid.step;
        },
        devicesLabelsArray() {
            return Object.keys(this.devices);
        },
    },
    watch: {
        devices() {
            this.prepareDevices();
        },
    },
    methods: {
        prepareDevices() {
            const devices = {};
            let index = 0;
            for (const deviceLabel in this.devices) {
                const device = this.devices[deviceLabel];
                if (!device.display) {
                    device.display = {
                        header_bg: "#3d3835",
                        body_bg: "#45423d",
                        group_bg: "#202020",
                        is_rotated: false,
                    };
                }
                devices[deviceLabel] = {};
                // type
                devices[deviceLabel].type = device.type;
                // colors
                devices[deviceLabel].color = {
                    body_bg: device.display.body_bg,
                    header_bg: device.display.header_bg,
                    group_bg: device.display.group_bg,
                };

                // position
                if (!device.display.row && !device.display.col) {
                    devices[deviceLabel].grid_position = {
                        row: 1,
                        col: 1,
                    };
                } else {
                    devices[deviceLabel].grid_position = {
                        row: device.display.row,
                        col: device.display.col,
                    };
                }
                devices[deviceLabel].position = this.getCellCoordinates(devices[deviceLabel].grid_position.row, devices[deviceLabel].grid_position.col);

                // class
                devices[deviceLabel].class = `device device--${deviceLabel} device--${index}`;

                // ports
                devices[deviceLabel].ports = {
                    inputs: device.inputs,
                    outputs: device.outputs,
                };
                // statuses
                devices[deviceLabel].statuses = {
                    is_rotated: device.display.is_rotated,
                    is_selected: false,
                };
                ++index;
            }
            this.preparedDevices = devices;
        },
        arrangeDevices() {
            let row = 1;
            let col = 1;
            let lastColumn = 0;
            let devicesAtRowCount = 0;
            let edgeDeviceIndex = 0;
            let index = 0;
            const preparedDevicesLabelsArray = Object.keys(this.preparedDevices);
            for (const deviceLabel in this.devices) {
                const device = this.devices[deviceLabel];
                if (!device.display.row && !device.display.col) {
                    this.preparedDevices[deviceLabel].grid_position = {
                        row: row,
                        col: col,
                    };
                    // this.$set(this.preparedDevices[deviceLabel].position, "x", this.getRealValue(col));
                    // this.$set(this.preparedDevices[deviceLabel].position, "y", this.getRealValue(row));
                    this.preparedDevices[deviceLabel].position['x'] = this.getRealValue(col)
                    this.preparedDevices[deviceLabel].position['y'] = this.getRealValue(row)
                    device.display.row = row;
                    device.display.col = col;
                }
                col = col + this.preparedDevices[deviceLabel].dimension.snap_width + 1;

                if (col > this.columnCount - this.preparedDevices[deviceLabel].dimension.snap_width) {
                    lastColumn = col - this.preparedDevices[deviceLabel].dimension.snap_width - 1;
                    edgeDeviceIndex = index;
                    col = 1;
                    if (devicesAtRowCount === 0) {
                        devicesAtRowCount = edgeDeviceIndex;
                    }
                }
                if (lastColumn !== 0 && edgeDeviceIndex !== 0) {
                    const refDevice = this.preparedDevices[preparedDevicesLabelsArray[index - devicesAtRowCount]];
                    row = refDevice.grid_position.row + refDevice.dimension.snap_height + 1;
                }
                ++index;
            }
        },
        getDeviceRelations(deviceLabel) {
            const device = this.preparedDevices[deviceLabel];
            for (const inputLabel in device.ports.inputs) {
                if (device.ports.inputs[inputLabel] === null) continue;
                if (device.ports.inputs[inputLabel].relation === undefined) continue;
                const relation = device.ports.inputs[inputLabel].relation;
                // let input_relation = device.ports.inputs[input_label];
                const input = deviceGrid.port_positions[deviceLabel].inputs[inputLabel];

                relation.to_coord.x = input.x;
                relation.to_coord.y = input.y;

                relation.is_selected = this.device_selection[deviceLabel];
            }
            for (const outputLabel in device.ports.outputs) {
                if (!device.ports.outputs[outputLabel]) continue;
                for (const output of device.ports.outputs[outputLabel]) {
                    if (output.relation === undefined) continue;
                    const relation = output.relation;
                    const input = deviceGrid.port_positions[deviceLabel].outputs[outputLabel];

                    relation.from_coord.x = input.x;
                    relation.from_coord.y = input.y;

                    relation.is_selected = device.statuses.is_selected;
                }
            }
        },
        getRelations() {
            const relations = [];
            for (const deviceLabel in deviceGrid.port_positions) {
                const device = this.preparedDevices[deviceLabel];
                for (const portLabel in device.ports.outputs) {
                    const outputs = device.ports.outputs[portLabel];
                    if (outputs) {
                        // цикл по портам в которые подключен выход
                        for (let k = 0; k < outputs.length; k++) {
                            const relation = {
                                from_device: deviceLabel,
                                to_device: outputs[k].device,
                                from_coord: { x: 0, y: 0 },
                                to_coord: { x: 0, y: 0 },
                                q: { x: 0, y: 0 },
                                color: "#000",
                                is_selected: this.device_selection[deviceLabel],
                            };
                            // откуда тянем линию
                            const deviceFromLabel = deviceLabel;
                            const portFromLabel = portLabel;
                            const output = deviceGrid.port_positions[deviceFromLabel].outputs[portFromLabel];
                            // куда тянем линию
                            const deviceToLabel = outputs[k].device;
                            const portToLabel = outputs[k].port;
                            const input = deviceGrid.port_positions[deviceToLabel].inputs[portToLabel];
                            const deviceTo = this.preparedDevices[deviceToLabel];

                            // создание связи
                            relation.from_coord = {
                                x: output.x,
                                y: output.y,
                            };
                            relation.to_coord = {
                                x: input.x,
                                y: input.y,
                            };

                            device.ports.outputs[portLabel][k].relation = relation;
                            deviceTo.ports.inputs[portToLabel].relation = relation;

                            let randomIndex = Math.floor(Math.random() * deviceGrid.colors_arr.length);
                            relation.color = deviceGrid.colors_arr[randomIndex];
                            relations.push(relation);
                        }
                    }
                }
            }
            this.relations = relations;
        },
        getSnapPosition(x, y) {
            const snapX = this.getSnapValue(x);
            const snapY = this.getSnapValue(y);
            return {
                x: snapX > 0 ? snapX : 0,
                y: snapY > 0 ? snapY : 0,
            };
        },
        getCellCoordinates(row, col) {
            return { x: this.options.grid.step * col, y: this.options.grid.step * row };
        },
        getGridIndex(x, y) {
            return { col: this.getSnapValue(x) / this.options.grid.step, row: this.getSnapValue(y) / this.options.grid.step };
        },
        getSnapValue(val, ceil = false) {
            if (ceil) {
                return Math.ceil(val / this.options.grid.step) * this.options.grid.step;
            } else {
                return Math.round(val / this.options.grid.step) * this.options.grid.step;
            }
        },
        getRealValue(val) {
            return val * this.options.grid.step;
        },
        getStepPercent(val) {
            return (val * this.options.grid.step) / 100;
        },
        initSvgInteractions() {
            // draw grid
            if (!this.inited) {
                const draw = SVG("#grid");
                draw.panZoom({ zoomFactor: 0.5 }).on("panEnd zoom", (e) => {
                    setTimeout(() => {
                        this.options.viewBox = e.target.attributes[6].value;
                    }, 100);
                });
                const gridGroup = SVG(".grid-group");
                for (let i = 0; i < this.getSnapValue(this.options.size.width) * 4 + this.options.grid.step; i += this.options.grid.step) {
                    const line = draw
                        .rect(this.getSnapValue(this.options.size.width * 4), 1)
                        .fill("url(#linesX)")
                        .move(0, i);
                    gridGroup.add(line);
                }
                for (let j = 0; j < this.getSnapValue(this.options.size.width) * 4 + this.options.grid.step; j += this.options.grid.step) {
                    const line = draw
                        .rect(1, this.getSnapValue(this.options.size.width * 4))
                        .fill("url(#linesY)")
                        .move(j, 0);
                    gridGroup.add(line);
                }
                this.inited = true;
            }
        },
        refresh: function() {
            
            this.options.size.width = q("#body").offsetWidth;
            this.options.size.height = q("#body").offsetHeight;
            this.options.size.viewBox = `0 0 ${q("#body").offsetWidth} ${q("#body").offsetHeight}`;
            this.initSvgInteractions();
            this.arrangeDevices();
            setTimeout(() => {
                this.getRelations();
            }, 100);
        },
        save: function() {
            this.$Manager.remote
                .dashboardStructureUpdate(this.$Dashboard.dashboard.id, this.devices)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
    mounted() {
        this.prepareDevices();
        deviceGrid.port_positions = {};
        setTimeout(() => {
            this.refresh();
        }, 300);
    },
};

function q(selector, all = false) {
    if (all) {
        return document.querySelectorAll(selector);
    } else {
        return document.querySelector(selector);
    }
}
</script>
<style lang="less">
#body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: "Helvetica";
    background: #545454;
    .buttons {
        position: absolute;
        top: 5px;
        left: 5px;
    }
}
svg {
    user-select: none;
}
.device {
    &__relation {
        stroke-linecap: round;
        fill: none;
        //pointer-events: none;
        &:hover {
            stroke: red;
        }
    }
    &__label {
        font-weight: 700;
    }
}
</style>
