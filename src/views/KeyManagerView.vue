<template>
    <div class="manager-container">
      <div class="service-middle-menu">
        <PanelHeader>Список ключей API</PanelHeader>
        <PanelNav>
            <PanelNavGroup>Управление</PanelNavGroup>
            <PanelNavList>
                <PanelNavElement 
                :event="() => $router.push({ name: 'keyAdd' })"
                :active="$route.path.includes('keyadd')">
                <div style="display: block" class="d-flex justify-content-between">
                  <b><i class="bi bi-plus-square-fill me-2"></i>
                   Добавить ключ </b>
                </div>
              </PanelNavElement>
            </PanelNavList>
          <template v-for="(keys, group) in tree" :key="group">
            <PanelNavGroup>LEVEL: {{ group }}</PanelNavGroup>
            <PanelNavList>
              <PanelNavElement v-for="key in keys" :key="key.id"
                :event="() => $router.push({ name: 'keyView', params: { key: key.id } })"
                :active="$route.params.key === key.id">
                <div style="display: block" class="d-flex justify-content-between">
                  <b>
                    <i v-if="!key.private" class="bi bi-unlock-fill"></i>
                    <i v-if="key.private" class="bi bi-lock-fill"></i>
                    {{ key.name }} </b>
                  <div><LevelBadge :level="key.level"></LevelBadge></div>
                </div>
                <small v-if="key.description">{{ key.description }}</small>
              </PanelNavElement>
            </PanelNavList>
          </template>
        </PanelNav>
      </div>
      <div class="service-right">
        <router-view v-if="keyList.length"/>
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
  import LevelBadge from './api/LevelBadge.vue';
  
  export default {
    name: 'ServiceView',
    components: {
      PanelHeader,
      PanelNav,
      PanelNavGroup,
      PanelNavList,
      PanelNavElement,
      LevelBadge
    },
    setup() {
      const form = ref({})
      const service = inject('service')
      const remote = inject('remote')
      const setMessage = inject('setMessage')
      const tree = ref({})
      const update = ref(false)
      const keyList = ref([])
      provide('keyList', keyList)
      return { form, service, remote, setMessage, tree, update, keyList }
    },
    watch: {
      keyList: function () {
        this.makeTree()
      }
    },
  
    mounted() {
        this.getApiKeyList()
        provide('getApiKeyList', this.getApiKeyList.bind(this))
    },
  
    methods: {
      async getApiKeyList(){
        try {
          this.keyList = await this.remote.command('apiKeyList', {})
          this.makeTree()
        }catch (error){
          this.setMessage('Ошибка получения списка ключей ',error.toString(), false, false)
        }
      },
      

      makeTree() {
        this.tree = {}
        for (let key of this.keyList){
            if (!this.tree[key.level]) this.tree[key.level] = [] 
            this.tree[key.level].push(key)
        }
      }
    }
  }
  </script>
  
  <style></style>