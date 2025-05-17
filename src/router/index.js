import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnectionsView from '../views/ConnectionsView.vue'
import ConAddView from '@/views/connections/ConAddView.vue'
import ConEditView from '@/views/connections/ConEditView.vue'
import ConExportView from '@/views/connections/ConExportView.vue'
import ConImportView from '@/views/connections/ConImportView.vue'
import ManagerView from '@/views/ManagerView.vue'
import IndexView from '@/views/manager/IndexView.vue'
import ServiceView from '@/views/manager/ServiceView.vue'
import ControlView from '@/views/manager/ControlView.vue'
import DeviceView from '@/views/manager/DeviceView.vue'
import ErrorsView from '@/views/manager/ErrorsView.vue'
import ApiServiceView from '@/views/ApiServiceView.vue'
import CommandView from '@/views/api/CommandView.vue'
import KeyManagerView from '@/views/KeyManagerView.vue'
import KeyView from '@/views/keys/KeyView.vue'
import KeyAddView from '@/views/keys/KeyAddView.vue'
import KeyUpdateView from '@/views/keys/KeyUpdateView.vue'
import DeviceManagerView from '@/views/DeviceManagerView.vue'
import DeviceInfoView from '@/views/device/DeviceInfoView.vue'
import InfoView from '@/views/manager/device/InfoView.vue'
import MetricsView from '@/views/manager/device/MetricsView.vue'
import ActionsView from '@/views/manager/device/ActionsView.vue'
import ChannelsView from '@/views/manager/device/ChannelsView.vue'
import ServiceApiView from '@/views/manager/ServiceApiView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      /*     Connections       */
      {
        path: '/',
        name: 'connections',
        component: ConnectionsView
      },
      {
        path: '/connection/add',
        name: 'connectionAdd',
        component: ConAddView
      },
      {
        path: '/connection/edit/:id',
        name: 'connectionEdit',
        component: ConEditView
      },
      {
        path: '/connection/export',
        name: 'connectionExport',
        component: ConExportView
      },
      {
        path: '/connection/import',
        name: 'connectionImport',
        component: ConImportView
      },
      /*     Manager       */
      {
        path: '/manager/:id',
        name: 'managerGeneral',
        component: ManagerView,
        children: [
          {
            path: '/manager/:id',
            name: 'manager',
            component: IndexView,
          },
          {
            path: '/manager/:id/service/:service',
            name: 'service',
            component: ServiceView,
            children: [
              { 
                path: 'control',
                name: 'serviceControl',
                component: ControlView,  
              },
              { 
                path: 'api',
                name: 'subServiceApi',
                component: ServiceApiView,  
              },
              { 
                path: 'errors',
                name: 'serviceErrors',
                component: ErrorsView,  
              },
              { 
                path: 'device/:device',
                name: 'serviceDevice',
                component: DeviceView,  
                children: [
                  { 
                    path: 'devicegeneralinfo',
                    name: 'deviceGeneralInfo',
                    component: InfoView,  
                  },
                  { 
                    path: 'devicechannels',
                    name: 'deviceChannels',
                    component: ChannelsView,  
                  },
                  { 
                    path: 'deviceactions',
                    name: 'deviceActions',
                    component: ActionsView,  
                  },
                  { 
                    path: 'devicemetrics',
                    name: 'deviceMetrics',
                    component: MetricsView,  
                  },

                ]
              }
            ]
          },
          {
            path: '/manager/:id/serviceApi',
            name: 'serviceApi',
            component: ApiServiceView,
            children: [
              { 
                path: ':command',
                name: 'commandApi',
                component: CommandView,  
              },
            ]
          },
          {
            path: '/manager/:id/devicemanager',
            name: 'deviceManager',
            component: DeviceManagerView,
            children: [
              { 
                path: 'deviceview/:device',
                name: 'deviceInfoView',
                component: DeviceInfoView,  
              },
            ]
          },
          {
            path: '/manager/:id/keymanager',
            name: 'keyManager',
            component: KeyManagerView,
            children: [
              { 
                path: 'keyview/:key',
                name: 'keyView',
                component: KeyView,  
              },
              { 
                path: 'keyadd',
                name: 'keyAdd',
                component: KeyAddView,  
              },
              { 
                path: 'keyupdate/:key',
                name: 'keyUpdate',
                component: KeyUpdateView,  
              },

            ]
          }
        ]
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
