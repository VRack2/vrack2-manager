<template>
    <div class="card mt-3" v-if="getPortList().length">
      <div class="card-header">
        <i v-if="type === 'input'" class="ms-1 me-1 bi bi-box-arrow-in-right"></i>
        <i v-if="type === 'output'" class="ms-1 me-1 bi bi-box-arrow-right"></i>
        {{ caption }}
        </div>
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="staticEmail2">Выбор порта</label>
          </div>
          <div class="col-auto">
            <select class="form-select" @change="changeSelect()" v-model="action">
              <option value=""></option>
              <option v-for="(pm, aname) in getPortList()" :key="'action-' + aname" :value="pm.port">{{ pm.port }} ({{
                getSpliceDescription(pm.description) }})</option>
            </select>
          </div>
          <div class="col-auto">
            <button :disabled="block || toConsole" @click="addToConsole()" type="button" class="btn btn-success">
              <template v-if="!toConsole"><i class="bi bi-plus-circle-fill"></i> В консоль</template>
              <template v-if="toConsole"><i class="bi bi-plus-circle-fill"></i> Добавлено</template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  
  import { ref, inject } from 'vue';
  
  export default {
    name: 'DeviceActionSelect',
    props: ['device', 'caption', 'type', 'ports'],
    components: {},
  
    setup() {
      const ConsoleWidgets = inject('ConsoleWidgets')
      const action = inject('activeAction')
      const block = ref(true)
      const toConsole = ref(false)
      let toConsoleTimer = false
      return { action, block, toConsole, toConsoleTimer, ConsoleWidgets }
    },
  
    methods: {
      getSpliceDescription(str) {
        if (typeof str !== "string") return ''
        return str.slice(0, 35)
      },

      getPortList(){
        const a = []
        for (const port of  this.device.ports) if (port.direct === this.type) a.push(port)
        return a
      },
  
      addToConsole() {
        this.toConsole = true
        this.ConsoleWidgets.addPort(this.$route.params.service, this.$route.params.device, this.action, this.type)
        this.toConsoleTimer = setTimeout(() => {
          this.toConsole = false
        }, 3000)
      },
  
      changeSelect() {
        if (!this.action) { this.block = true; return }
        this.toConsole = false
        this.block = false
      }
    }
  }
  </script>