export default {
    relations: {},
    port_positions: {},
    grid: {
        step: 50,
        color: "#fff",
        last_column: 0,
        row: 1,
        col: 1,
        edge_device_index: 0,
        devices_at_row_count: 0,
    },
    colors: {
        header_bg: "#3d3835",
        body_bg: "#45423d",
        group_bg: "#202020",
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

    fromStep(val) {
        return val * this.grid.step;
    },

    getRandomColor(){
        let randomIndex = Math.floor(Math.random() * this.colors_arr.length);
        return this.colors_arr[randomIndex];
    },

    getStepPercent(val) {
        return (val * this.grid.step) / 100;
    },
    getRealValue(val) {
        return val * this.grid.step;
    },
    getSnapValue(val, ceil = false) {
        if (ceil) {
            return Math.ceil(val / this.grid.step) * this.grid.step;
        } else {
            return Math.round(val / this.grid.step) * this.grid.step;
        }
    },
};
