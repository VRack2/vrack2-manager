<template>
    <div class="card mt-3">
        <div class="card-header d-flex justify-content-start">
            <div class="d-flex align-items-center">
                <label class="form-label m-0 me-3">Период</label>
                <select class="form-select" v-model="model.activePeriod" @change="updatePeriod()">
                <option v-for="(val, ds) of control.periodPreset" :key="'ppreset-' + ds" :value="ds">
                    {{ val }}
                </option>
              </select>
            </div>
            <div class="d-flex align-items-center ms-4">
                <label class="form-label m-0 me-3">Обновление </label>
                <select class="form-select" v-model="model.activeTimer" @change="updateTimer()">
                    <option v-for="(val, ds) of control.timerPreset" :key="'period-' + val" :value="ds">
                        {{ val }}
                    </option>
                </select>
                <div><button class="btn ms-2 btn-dark" @click="reload()"><i class="bi bi-arrow-repeat"></i></button></div>
            </div>
            <div class="d-flex align-items-center ms-4">
                <select class="form-select" v-model="model.activeSize" @change="updateSize()">
                    <option v-for="(val, ds) of control.sizeList" :key="'period-' + val" :value="ds">
                        {{ ds }}
                    </option>
                </select>
            </div>

            <div class="d-flex align-items-center ms-4">
                <div><button class="btn ms-2 btn-dark" @click="toggleVAlign()">
                    <i v-if="model.activeVAlign === 1" class="bi bi-align-middle"></i>
                    <i v-if="model.activeVAlign === 2" class="bi bi-align-bottom"></i>
                </button></div>
                <!-- <label class="form-label m-0 me-3"><i class="bi bi-arrows-vertical"></i></label>
                <select class="form-select" v-model="model.activeVAlign" @change="updateVAlign()">
                    <option v-for="(val, ds) of control.vAlign" :key="'period-' + val" :value="ds">
                        {{ val }}
                    </option>
                </select> -->
            </div>

        </div>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
   name: 'MetricsControl',
   props: ['control'],
   components: {},
   setup() {
      const model = ref({
        activePeriod: 'now-6h:now',
        activeTimer: 15000,
        activeSize: 'middle',
        activeVAlign: 1
      })
      return { model }
   },
   mounted(){
    this.model.activePeriod = this.control.activePeriod
    this.model.activeTimer = this.control.activeTimer
    this.model.activeSize = this.control.size
    this.model.activeVAlign = this.control.activeVAlign
   },

   methods: {
    reload(){
       this.control.updateIndex()
    },
    updatePeriod(){
      this.control.setPerionPreset(this.model.activePeriod)
    },
    updateTimer(){
      this.control.setTimerPreset(this.model.activeTimer)
    },
    updateSize(){
      this.control.setSize(this.model.activeSize)
    },
    toggleVAlign(){
        if (this.model.activeVAlign === 1) { 
            this.control.setVAlign(2)
            this.model.activeVAlign = 2
        } else if (this.model.activeVAlign === 2) {
            this.control.setVAlign(1)
            this.model.activeVAlign = 1
        }
    }
   }
}
</script>
<style></style>