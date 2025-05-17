<template>
    <div class="container-fluid h100hidden border border-top-0">
        <div class="row h100hidden">
            <div class="col-xl-6 h100">
                <ul class="nav mt-2 nav-underline nav-fill" v-if="Subscribes.registered.length">
                    <li class="nav-item" @click="leftTab = 'ChannelsView'">
                        <span :class="{ 'active': (leftTab === 'ChannelsView')} " class="nav-link nav-link-display border-bottom">Рабочие каналы</span>
                    </li>
                    <li class="nav-item" @click="leftTab = 'EventsWidget'">
                        <span :class="{ 'active': (leftTab === 'EventsWidget'), 'border-warning':flagEvent} " class="border-bottom nav-link nav-link-display">Просмотр событий</span>
                    </li>
                    <li class="nav-item" @click="leftTab = 'RenderView'">
                        <span :class="{ 'active': (leftTab === 'RenderView'), 'border-warning':flagRender} " class="border-bottom nav-link nav-link-display">Онлайн данные</span>
                    </li>
                </ul>
                <div v-if="Subscribes.registered.length"><component :is="leftTab"></component></div>
                <div v-if="!Subscribes.registered.length"><EmptyChannelsView></EmptyChannelsView></div>
            </div>
            <div class="col-xl-6 h100" style="background-color: #212529;">
                <ul class="nav mt-2 nav-underline nav-fill" v-if="ConsoleWidgets.actionsList.length || ConsoleWidgets.metricList.length">
                    <li class="nav-item" @click="rightTab = 'ActionsView'">
                        <span :class="{ 'active': (rightTab === 'ActionsView')} " class="nav-link nav-link-display border-bottom">Экшены ({{ ConsoleWidgets.actionsList.length }})</span>
                    </li>
                    <li class="nav-item" @click="rightTab = 'MetricsView'">
                        <span :class="{ 'active': (rightTab === 'MetricsView')} " class="border-bottom nav-link nav-link-display">Метрики ({{ ConsoleWidgets.metricList.length }})</span>
                    </li>
                </ul>
                <div v-if="ConsoleWidgets.actionsList.length || ConsoleWidgets.metricList.length"><component :is="rightTab"></component></div>
                <div v-if="!ConsoleWidgets.actionsList.length && !ConsoleWidgets.metricList.length"><EmptyWidgetsView></EmptyWidgetsView></div>
            </div>
        </div>
    </div>
  </template>
  <script>

import { inject, provide, ref, watch } from 'vue';

import ChannelsView from './console/ChannelsView.vue';
import RenderView from './console/RenderView.vue';
import EventsWidget from './device/info/EventsWidget.vue';
import EmptyChannelsView from './console/EmptyChannelsView.vue';
import EmptyWidgetsView from './console/EmptyWidgetsView.vue';
import ActionsView from './console/ActionsView.vue';
import { MetricsControl } from '@/classes/Metrics'
import MetricsView from './console/MetricsView.vue';

export default {
    name: 'ConsoleView',
    components: { 
        ChannelsView, 
        EventsWidget, 
        RenderView, 
        EmptyChannelsView, 
        EmptyWidgetsView,
        ActionsView,
        MetricsView
    },
    setup() {
        const Subscribes = inject('Subscribes')
        const ConsoleWidgets = inject('ConsoleWidgets')
        const leftTab = ref('ChannelsView')
        const rightTab = ref('ActionsView')
        const flagChannel = ref(false)
        const flagEvent = ref(false)
        const flagRender = ref(false)
        const MetricControl = ref(new MetricsControl())
        provide('MetricControl', MetricControl)
        MetricControl.value.start()
        // MetricControl.value.init()
        return { leftTab, rightTab, Subscribes, flagChannel, flagEvent, flagRender, ConsoleWidgets }
    },
    mounted() {
        watch(this.Subscribes.shares,()=>{
            if (this.flagRender) return
            this.flagRender = true
            setTimeout(()=>{ this.flagRender = false }, 200)
        })

        watch(this.Subscribes.messages,()=>{
            if (this.flagEvent) return
            this.flagEvent = true
            setTimeout(()=>{ this.flagEvent = false }, 200)
        })
    }


  }
  </script>


<style>
.h100{
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    overflow: auto;
}
.h100hidden {
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    overflow: hidden;
}

.nav-link-display {
    cursor: pointer;
}
</style>