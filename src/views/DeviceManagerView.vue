<template>
    <div class="manager-container">
      <div class="service-middle-menu">
        <PanelHeader>Менеджер устройств</PanelHeader>
        <PanelNav>
          <template v-for="(devices, group) in tree" :key="group">
            <PanelNavGroup><div class="d-flex align-items-center justify-content-between"><span class="ms-2">{{ group }}</span>
                <button class="btn ps-2 pe-2 pt-0 pb-0 m-0" @click="this.showing[group] = !this.showing[group]">
                    <i v-if="!this.showing[group]" class="bi bi-plus-square-fill"></i>
                    <i v-if="this.showing[group]" class="bi bi-dash-square-fill"></i>
                </button>
            </div></PanelNavGroup>
            <PanelNavList v-if="this.showing[group]">
                <PanelNavElement 
                v-for="device of devices"
                :event="() => $router.push({ name: 'deviceInfoView',params:{device: group + '.' + device} })"
                :active="( group + '.' + device ) === $route.params.device"
                :key="device + 'device'">
                <div style="display: block" class="d-flex justify-content-between">
                  <b><i class="bi bi-hdd me-2"></i>
                   {{ device }} </b>
                </div>
              </PanelNavElement>
            </PanelNavList>
          </template>
        </PanelNav>
      </div>
      <div class="service-right">
        <router-view v-if="vendors.length"/>
      </div>
    </div>
  </template>
  <script>
  
  import { inject, provide, ref } from 'vue';
  import PanelHeader from '@/components/SidePanel/PanelHeader.vue';
  import PanelNav from '@/components/SidePanel/PanelNav.vue';
  import PanelNavGroup from "@/components/SidePanel/PanelNavGroup.vue";
  import PanelNavList from "@/components/SidePanel/PanelNavList.vue";
  import PanelNavElement from '@/components/SidePanel/PanelNavElement.vue';
//   import LevelBadge from './api/LevelBadge.vue';
  
  export default {
    name: 'ServiceView',
    components: {
      PanelHeader,
      PanelNav,
      PanelNavGroup,
      PanelNavList,
      PanelNavElement,
    //   LevelBadge
    },
    setup() {
      const form = ref({})
      const service = inject('service')
      const remote = inject('remote')
      const setMessage = inject('setMessage')
      const tree = ref({})
      const update = ref(false)
      const vendors = ref([])
      const showing = ref({})
      provide('keyList', vendors)
      return { form, service, remote, setMessage, tree, update, vendors, showing }
    },
  
    mounted() {
        this.getDeviceList()
    },
  
    methods: {
      async getDeviceList(){
        try {
          this.vendors = await this.remote.command('vendorList', {})
          await this.makeTree()
        }catch (error){
          this.setMessage('Ошибка получения списка ключей ',error.toString(), false, false)
        }
      },
      

      async makeTree() {
        this.tree = {}
        for (let vendor of this.vendors){
            this.showing[vendor] = false
            this.tree[vendor] = await this.remote.command('vendorDevices', { vendor })
            this.tree[vendor].sort()
        }
      }
    }
  }
  </script>
  
  <style></style>