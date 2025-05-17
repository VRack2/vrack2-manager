<template>
  <div class="card mt-3">
    <div class="card-header">Выбор Экшена устройства</div>
    <div class="card-body">
      <div class="row g-3 align-items-center">
        <div class="col-auto">
          <label for="staticEmail2">Выбор экшена</label>
        </div>
        <div class="col-auto">
          <select class="form-select" @change="changeSelect()" v-model="action">
            <option value=""></option>
            <option v-for="(pm, aname) in device.actions" :key="'action-' + aname" :value="aname">{{ aname }} ({{
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
  props: ['device'],
  components: {},

  setup() {
    const ConsoleWidgets = inject('ConsoleWidgets')
    const Widgets = inject('Widgets')
    const action = inject('activeAction')
    const block = ref(true)
    const toConsole = ref(false)
    let toConsoleTimer = false
    return { action, block, toConsole, toConsoleTimer, ConsoleWidgets, Widgets }
  },

  methods: {
    getSpliceDescription(str) {
      if (typeof str !== "string") return ''
      return str.slice(0, 35)
    },

    addWidget(){
       this.action
    },

    addToConsole() {
      this.toConsole = true
      this.ConsoleWidgets.addAction(this.$route.params.service, this.$route.params.device, this.action, this.device)
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