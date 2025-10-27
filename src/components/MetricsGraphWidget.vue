<template>
  <div class="card mt-3">
    <div class="card-header ">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <template v-if="metric.service"><span class="text-secondary">services</span>.<span
              class="text-warning-emphasis">{{ metric.service }}</span>.<span
              class="text-secondary">devices</span>.<span class="text-info">{{ metric.device }}</span></template>
          <template v-if="metric.name">{{ metric.name }}</template>
        </div>
        <span v-if="updatingList.length" class="loader-metric"></span>
        <button v-if="remove" class="btn btn-sm btn-danger" @click="remove(metric.id)"><i
            class="bi bi-dash-circle-fill"></i></button>
      </div>
    </div>
    <div class="row">
      <v-chart  :class="control.sizeList[control.size]" :option="option" autoresize />
    </div>
  </div>
</template>

<script>
//   import { inject, ref } from "@vue/runtime-core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import "@/assets/dark2";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { provide, inject, ref, watch } from "vue";

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
]);

const defaultSeries = {
  showSymbol: false,
  symbol: "emptyCircle", //Set as a solid point
  symbolSize: 5, //Set the size of the solid point
  itemStyle: { borderWidth: 1 },
  label: { show: false, },
  connectNulls: true,
  data: [],
  type: "line",
  smooth: true,
}

export default {
  components: { VChart },
  props: ["metric", 'control', 'remove'],
  setup() {
    const theme = provide(THEME_KEY, "dark2");
    const remote = inject("remote");
    const data = ref({});
    const updatingList = ref([])
    const option = ref({
      animation: false,
      grid: { top: 25, bottom: 30, right: 20, left: 70 },
      tooltip: { trigger: "axis" },
      legend: {
        show: true,
        data: [],
        textStyle: { color: '#ffffff' },
        icon: 'circle'
      },
      xAxis: {
        type: "time",
        splitLine: { show: true, lineStyle: { color: "#444" } },
        onZero: false,
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: '{value}' },
        splitLine: { show: true, lineStyle: { color: "#444" } },
      },
      series: [],
    });
    const updateTimer = ref(false)
    return { updateTimer, remote, data, option, theme, updatingList };
  },

  mounted() {

    this.option.yAxis.axisLabel = { formatter: '{value}' + this.metric.unit }

    this.updateData();
    watch(this.control.index, () => {
      this.updateData()
    })

    watch(this.metric.metricList, () => {
      this.updateSeries()
    })

    this.updateSeries()
  },

  methods: {
    updateSeries() {
      this.clearSeries()
      let i = 0
      for (const metric of this.metric.metricList) {
        const dser = JSON.parse(JSON.stringify(defaultSeries))
        dser.itemStyle.color = metric.color
        dser.name = metric.metric
        this.option.legend.data.push(metric.metric)
        this.option.series[i] = dser
        i++
      }
      this.updateData()
    },

    clearSeries() {
      for (const ser of this.option.series) { ser.data = [] }
      this.option.legend.data.splice(0, this.option.legend.data.length)
    },

    async updateData() {
      let i = 0
      for (const metric of this.metric.metricList) {
        this.getMetricData(metric.service, metric.device, metric.metric, i, metric.id)
        i++
      }
    },

    /**
     * 
    */
    async getMetricData(service, device, metric, index, id) {
      if (this.isUpdaing(id)) return;

      if (this.control.activeVAlign === 1){
          this.option.yAxis.min = 0
          this.option.yAxis.max = undefined
      }

      if (this.control.activeVAlign === 2){
        this.option.yAxis.min = 'dataMin'
        this.option.yAxis.max = 'dataMax'
      }

      let result
      try {
        this.toUpdating(id)
        result = await this.remote.command(this.metric.command, {
          service: service,
          device: device,
          metric: metric,
          period: this.control.activePeriod,
          precision: '600' 
        });
      } catch (err) {
        this.endUpdating(id)
        return []
      }
      this.endUpdating(id)
      const tmpData = [];
      for (const row of result.rows) {
        const nData = [new Date(row.time * 1000).toISOString()]
        nData.push(row.value);
        tmpData.push(nData)
      }
      this.option.series[index].data = tmpData
      return tmpData;
    },

    isUpdaing(id){
        for (let i = 0; i< this.updatingList.length; i++){
            if (this.updatingList[i] === id) return true
        }
        return false
    },

    toUpdating(id){
        this.updatingList.push(id)
    },

    endUpdating(id){
        for (let i = 0; i< this.updatingList.length; i++){
            if (this.updatingList[i] === id) { 
                this.updatingList.splice(i, 1)
                return
            }
        }
    }
  },
};
</script>
<style>
.chart-sm {
  height: 200px;
}

.chart-md {
  height: 300px;
}

.chart-lg {
  height: 400px;
}


.loader-metric {
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 50%;
  color: #FF3D00;
  animation: fill 1s ease-in infinite alternate;
}

.loader-metric::after {
  left: auto;
  right: 16px;
  animation-duration: 1.1s;
}

@keyframes fill {
 0% {  box-shadow: 0 0 0 2px inset }
 100%{ box-shadow: 0 0 0 10px inset }
}
  
</style>