<template>
  <div>
    <div class="row">
      <v-chart class="chart" :option="option" autoresize />
    </div>
  </div>
</template>

<script>
import { inject, ref } from "@vue/runtime-core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import "@/assets/dark2";
import {
  GridComponent,
  TooltipComponent,

} from "echarts/components";
import { provide } from "vue";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
]);

export default {
  components: { VChart },
  props: ["metric", 'device'],
  setup() {
    const theme = provide(THEME_KEY, "dark2");
    const remote = inject("remote");
    const data = ref({});
    const activePreset = inject("preset")
    const conf = inject("conf")
    const reload = inject("reload")
    const option = ref({
      animation: false,
      grid: { top: 20, bottom: 30, right: 10, left: 70 },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      xAxis: {
        type: "time",
        // data: [],
        splitLine: { 
          show: true,
          lineStyle: {
            color: "#444"
          }
        },
        onZero: false,
      },
      yAxis: {
        type: "value",
        min: "dataMin",
        splitLine: { 
          show: true,
          lineStyle: {
            color: "#444"
          }
        },
      },
      series: [
        {
          showSymbol: false,
          symbol: "emptyCircle", //Set as a solid point
          symbolSize: 5, //Set the size of the solid point
          itemStyle: {
            //Circle style
            borderWidth: 1,
            color: "#f60",
          },
          label: {
            show: false,
            position: "bottom",
            textStyle: {
              fontSize: 10,
            },
          },
          connectNulls: true,
          data: [],
          type: "line",
          smooth: true,
        },
      ],
    });
    const updateTimer = ref(false)
    return {conf, updateTimer, remote, data, option, activePreset, theme, reload };
  },

  watch: {
    activePreset: function () {
      this.updateData()
    }
  },

  mounted() {
    this.updateData();
    this.reload = this.updateData.bind(this)
  },

  unmounted() {
  },

  methods: {
    async updateData() {
      let result
      try {
        result = await this.remote.command('serviceDeviceMetric',{
            service: this.$route.params.service,
            device: this.device,
            metric: this.metric,
            period: this.activePreset,
            precision: '600'
          }
        );
      } catch (err) {
        this.option.series[0].data = []
        return
      }
      const tmpData = [];
      for (const row of result.rows) {
        const nData = [new Date(row.time * 1000).toISOString()]
        nData.push(row.value);
        tmpData.push(nData)
      }
      this.option.series[0].data = tmpData;
    },
  },
};
</script>
<style>
.chart {
  height: 200px;
}
</style>