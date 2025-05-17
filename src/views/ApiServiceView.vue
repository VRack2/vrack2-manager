<template>
  <div class="manager-container">
    <div class="service-middle-menu">
      <PanelHeader>Команды API</PanelHeader>
      <PanelNav>
        <template v-for="(commands, group) in tree" :key="group">
          <PanelNavGroup>{{ group }}</PanelNavGroup>
          <PanelNavList>
            <PanelNavElement v-for="command in commands" :key="command.command"
              :event="() => $router.push({ name: 'commandApi', params: { command: command.command } })"
              :active="$route.params.command === command.command">
              <div style="display: block" class="d-flex justify-content-between">
                <b><i v-if="!command.icon" class="bi bi-command"></i> 
                   <i v-if="command.icon"  :class="'bi-' + command.icon" class="bi"></i> 
                  {{ command.command }} </b>
                <div><LevelBadge :level="command.level"></LevelBadge></div>
              </div>
              <small v-if="command.short">{{ command.short }}</small>
            </PanelNavElement>
          </PanelNavList>
        </template>
      </PanelNav>
    </div>
    <div class="service-right">
      <router-view />
    </div>
  </div>
</template>
<script>

import { inject, ref } from 'vue';
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
    const tree = ref({ 'default': [] })
    return { form, service, remote, setMessage, tree }
  },
  watch: {
    'service.run': function () {
    }
  },

  mounted() {
    this.makeTree()
  },

  methods: {
    makeTree() {
      for (let command in this.remote.commandsList) {
        const cc = this.remote.commandsList[command]
        if (cc.owner) {
          if (!this.tree[cc.owner]) this.tree[cc.owner] = []
          this.tree[cc.owner].push(cc)
        } else this.tree['default'].push(cc)
      }
    }
  }
}
</script>

<style></style>