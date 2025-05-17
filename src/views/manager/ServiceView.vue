<template>
  <div  class="manager-container">
    <div class="service-middle-menu">
      <PanelHeader>{{ service.name }}<small style="display: block;" class="ms-3">ID: {{ service.id }}</small></PanelHeader>
      <PanelNav>
        <PanelNavGroup>Управление</PanelNavGroup>
        <ControlWidget></ControlWidget>
        <PanelNavGroup>Сервис</PanelNavGroup>
        <PanelNavList>
            <PanelNavElement :active="($route.name === 'serviceControl')" :event="() => $router.push({name: 'serviceControl'})">
                <i class="bi bi-info-square-fill me-1 ms-1"></i> Информация
            </PanelNavElement>
            <PanelNavElement :active="false" :event="() => routeErrors()">
              <i class="bi bi-exclamation-circle-fill me-1 ms-1"></i> Ошибки ({{ service.errors }})
            </PanelNavElement>
            <PanelNavElement :active="false" :event="() => actionMap()">
              <i class="bi bi-map-fill me-1 ms-1"></i> Структура Сервиса
            </PanelNavElement>
            <PanelNavElement v-if="service.run"  :active="($route.name === 'subServiceApi')" :event="() => $router.push({name: 'subServiceApi'})">
              <i class="bi bi-asterisk me-1 ms-1"></i> API Сервиса
            </PanelNavElement>
        </PanelNavList>
        <PanelNavGroup>Устройства</PanelNavGroup>
        <DeviceListWidget v-if="service.run && structure"></DeviceListWidget>
      </PanelNav>
    </div>
    <div class="service-right">
      <router-view :key="service.id"/>
    </div>
  </div>
</template>
<script>

import { inject, provide, ref } from 'vue';

import ControlWidget from './ControlWidget.vue';
import DeviceListWidget from './DeviceListWidget.vue';
import PanelHeader from '@/components/SidePanel/PanelHeader.vue';
import PanelNav from '@/components/SidePanel/PanelNav.vue';
import PanelNavGroup from "@/components/SidePanel/PanelNavGroup.vue";
import PanelNavList from "@/components/SidePanel/PanelNavList.vue";
import PanelNavElement from '@/components/SidePanel/PanelNavElement.vue';

export default {
  name: 'ServiceView',
  components: {
    ControlWidget,
    DeviceListWidget,
    PanelHeader,
    PanelNav,
    PanelNavGroup,
    PanelNavList,
    PanelNavElement
  },
  setup() {
    const form = ref({})
    const service = inject('service')
    const remote = inject('remote')
    const setMessage = inject('setMessage')
    const setMap = inject('setMap')
    const structure = ref(false)
    provide('structure', structure)
    return { form, service, remote, setMessage, setMap, structure }
  },
  watch: {
      'service.run': function() {
        this.updateStruct()
      }
  },

  beforeRouteUpdate(to ,from, next){
    if (to.params.id) this.updateStruct()
    next()
  },
  
  mounted(){
    this.updateStruct()
  },

  methods: {
    async updateStruct(){
      try {
        if (this.service.run) { 
          this.structure = await this.remote.command('structureGet', { id: this.service.id })
          return
        } 
      }catch (err){ console.log(err) }
      this.structure = false
    },
    async actionMap(){
      try {
        const struct = await this.remote.command('structureGet', { id: this.service.id })
        const actions = []
        if (this.remote.checkAccess('structureUpdate')) {
          actions.push({
            caption: 'Save',
            action: async (structure) => {
              await this.remote.command('structureUpdate', { id: this.service.id,  structure })
            }
          })
        }
        this.setMap(struct, actions )
      } catch (error) {
        this.setMessage('Error set map', error.toString(), false, false)
      }
    },

    async routeErrors(){
      if (!this.service.errors) return
      this.$router.push({name: "serviceErrors"})
    },
  }
}
</script>

<style>
.service-middle-menu {
  overflow-y: auto;
  overflow-x: hidden;
  /* overflow: auto; */
  width: 300px;
  height: 100%;
  background-color: #1b1b1b;
}


.service-right {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  /* background-color: #b03b3b; */
}
</style>