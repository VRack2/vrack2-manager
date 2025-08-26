<template>
  <div class="message-in-head" style="position: fixed; width: 100%; top: 0px; z-index: 100">
    <Message v-if="showMessage" :message="message" :hideMessage="hideMessage"></Message>
  </div>
  <div class='toggle-console-button btn btn-sm btn-dark border border-light-subtle' @click='showConsole = !showConsole'>
    <i v-if="!showConsole" class="bi bi-layout-split"></i>
    <i v-if="showConsole" class="bi bi-layout-text-sidebar-reverse"></i>
    
  </div>
  <div class="console-div rounded-bottom" v-show="showConsole">
    <ConsoleView></ConsoleView>
  </div>
  <div class="manager-container">
    <map-modal-view v-if="showMap" :structure="mapSettings.structure" :actions="mapSettings.actions"></map-modal-view>
    <div class="col-3 wwsw bg-body-tertiary p-0">
      <!-- LEFT PANEL -->
       <SideNavigationWidget v-if="ready"></SideNavigationWidget>
       <hr class="m-2">
      <services-widget :services="services" :servicesTree="servicesTree" :servicesReload="serviceListUpdate"></services-widget>
    </div>
    <div class="col overy p-0 d-flex" style="height: 100%">
      <router-view v-if="ready" />
    </div>
  </div>
</template>

<script>
import { inject, provide, ref } from "vue";
import { VRackRemoteWeb } from "vrack2-remote"
import Message from "@/components/Message.vue"
import ServicesWidget from './manager/ServicesWidget.vue';
import MapModalView from "./manager/MapModalView.vue";
import SideNavigationWidget from "./manager/SideNavigationWidget.vue";
import { Subscribes } from "@/classes/Subscribes"
import { ConsoleWidgets } from "@/classes/ConsoleWidgets"
import ConsoleView from "@/views/manager/ConsoleView.vue"


export default {
  name: "HomeView",
  components: {
    Message,
    ServicesWidget,
    MapModalView,
    ConsoleView,
    SideNavigationWidget
  },

  beforeRouteUpdate(to, from, next) {
    this.updateActiveService(to.params)
    next()
  },

  mounted: function () {
    if (localStorage.settings) {
      this.settings = JSON.parse(localStorage.settings);
      if (!Array.isArray(this.settings.connections)) this.settings.connections = []
    }
    const id = this.$route.params.id
    const tmpConn = this.getConnections(id)
    if (tmpConn === false) { this.$router.push('/'); return }
    this.connection = tmpConn
    this.remote.on('close', this.onRemoteClose.bind(this))
    this.remote.host = this.connection.address
    this.remote.setKey(this.connection.secret)
    this.remote.setPrivateKey(this.connection.private)
    this.remote.on('error', (error) => {
      this.setMessage('Websocket error', error.toString())
    })
    this.remoteConnect()
    window.addEventListener('keypress', this.onKeyPress);
  },

  beforeUnmount() {
        window.removeEventListener('keypress', this.onKeyPress);
  },

  setup: function () {
    const message = ref({ test: 'test' })
    const connection = ref({})
    const services = ref({})
    const service = ref(false)
    const servicesTree = ref([])
    const showMessage = ref(false)
    const ready = ref(false)
    const remote = new VRackRemoteWeb()
    const showMap = ref(false)
    const showConsole = ref(false)
    const SubscribesRef = ref(Subscribes)
    const ConsoleWidgetsRef = ref(ConsoleWidgets)
    // Subscribes.shares = ref({})
    // Subscribes.messages = ref([])
    const mapSettings = ref({
      structure: false,
      actions: [],
      id: ''
    })

    const setMessage = (m, sm, settings = false, spiner = false) => {
      showMessage.value = true;
      message.value = {
        message: m,
        subMessage: sm,
        primarySpinner: spiner,
        settings: settings,
      };
    }

    /** 
     * SET MAP CONFIGURATION 
     * 
     * @param {Array} actions
     * @param {Object} structure
     * */
    const setMap = (structure, actions) => {
      actions.push({
        caption: 'Close',
        action: () => { showMap.value = false }
      })

      mapSettings.value = { structure, actions }
      showMap.value = true
    }

    Subscribes.setRemote(remote)

    // Settings
    const settings = inject("settings");

    provide("ready", ready)
    provide("services", services)
    provide("service", service)
    provide("remote", remote)
    provide("connection", connection)
    provide('setMessage', setMessage)
    provide('setMap', setMap)
    provide('Subscribes', SubscribesRef)
    provide('ConsoleWidgets', ConsoleWidgetsRef)
    
    return { 
      settings,
      ready, 
      remote, 
      connection, 
      services, 
      service, 
      message, 
      showMessage, 
      servicesTree, 
      setMessage, 
      showMap, 
      setMap, 
      mapSettings, 
      showConsole, 
      Subscribes: SubscribesRef,
      ConsoleWidgets: ConsoleWidgetsRef
    };
  },

  methods: {
    onKeyPress(key){
      if (key.shiftKey === true && key.charCode === 126) {
        this.showConsole = !this.showConsole;
      }
    },

    async remoteConnect() {
      try {
        this.setMessage('Соединение с сервером', 'Ожидание ответа', true, true)
        await this.remote.connect()
        this.setMessage('Проверка ключа ', 'Отправка секретного ключа серверу', false, true)
        await this.remote.apiKeyAuth()
        this.setMessage('Получение списка сервисов', 'Построение списка сервисов и получение доп. Информации', false, true)
        await this.serviceListUpdate()
        /** update remote command list for check access */
        await this.remote.commandsListUpdate()
        /* SET Active service */
        this.updateActiveService(this.$route.params)
        /* Update online service info/data */
        this.remote.channelJoin('manager.service', (message) => {
          Object.assign(this.services[message.data.id], message.data)
        })
        this.showMessage = false
        this.ready = true
      } catch (error) {
        this.setMessage('Error connection', error.toString(), false, false)
        this.showMessage = true
      }
    },

    async onRemoteClose() {
      this.ready = false
      this.setMessage('Соединение с сервером было разорвано')
    },

    async serviceListUpdate() {
      try {
        this.services = await this.remote.command('serviceUpdateList', {})
        var tmpgroups = new Map();
        for (var serviceId in this.services) {
          var sData = this.services[serviceId];
          if (!tmpgroups.has(sData.group)) tmpgroups.set(sData.group, []);
          tmpgroups.get(sData.group).push({ id: sData.id, name: sData.name });
        }
        var tree = [];
        for (var key of tmpgroups.keys()) {
          var value = tmpgroups.get(key);
          value.sort((prev, next) => {
            return prev.name > next.name ? 1 : -1;
          });
          tree.push({ group: key, list: value });
        }
        tree.sort((prev, next) => prev.group > next.group ? 1 : -1);
        this.servicesTree = tree;
      } catch (error) {
        this.setMessage('Ошибка обновления списка', error.toString())
      }
    },

    updateActiveService(params) {
      if (params.service) {
        if (this.services[params.service]) {
          this.service = this.services[params.service]
        }
      } else {
        this.service = false
      }
    },

    getConnections(id){
      for (const connection of this.settings.connections) {
        if (connection.id !== id) continue
        return connection
      }
      return false
    },
   

    hideMessage() {
      this.showMessage = false
    }
  }
};
</script>

<style>
.status-bar {
  padding: 5px;
}

.btn-exs {
  padding: 0.03rem 0.2rem;
  font-size: 0.7rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.btn-exs-sb {
  margin-top: 5px;
  margin-bottom: 5px;
}

.btn-exs-back {
  margin-right: 10px;
}

.btn-list-block {
  text-decoration: underline;
  border-radius: 0;
  padding-top: 10px;
  padding-bottom: 10px;
}

.overy {
  overflow: auto;
  height: 100%;
}

.wwsw {
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  overflow: auto;
  width: 250px;
  height: 100%;
}

.manager-container {
  display: grid;
  grid-template-columns: 1fr 40fr;
  height: 100%;
}

.toggle-console-button{
  position:fixed;
  top: 0%;
  right: 1%;
  z-index: 1000;
}

.console-div {
  z-index: 900;
  position: fixed;
  /* top:10%; */
  left:1%;
  width: 98%;
  height: 95%;
  overflow:auto;
  background-color:#1b1b1b;
}
</style>
