<template>
   <div class="card mt-2" style="">
      <div class="card-header">Подключаемые каналы устройства</div>
      <div class="card-body p-2">
         <div class="btn-group">
            <button class="btn" :class="ch.active ? ch.aclass : ch.class" @click="toggleChannel(ch.channel, ch.active)"
               v-for="ch in channelsList" :key="ch.channel">{{ ch.channel }}</button>
         </div>
      </div>
   </div>
   <div class="card mt-2" style="" v-if="shares">
      <div class="card-header">Данные</div>
      <div class="card-body p-2" style="background-color: #181a1f;">
         <JSONView field="root" :root="true" :data="sharesData"></JSONView>
      </div>
   </div>
   <EventsWidget :service="$route.params.service" :device="$route.params.device"></EventsWidget>
</template>
<script>
import { inject, ref, watch } from 'vue';
import EventsWidget from './info/EventsWidget.vue';

export default {
   name: 'DeviceInfoView',
   components: {
      EventsWidget
   },

   mounted() {
      this.updateChannelList()
      watch (this.Subscribes.shares, ()=>{
         if ( this.Subscribes.shares[this.$route.params.service] && this.Subscribes.shares[this.$route.params.service][this.$route.params.device])  this.sharesData = this.Subscribes.shares[this.$route.params.service][this.$route.params.device]
      })
      watch ( this.Subscribes.registered, ()=>{
         this.updateChannelList()
      })
   },

   setup() {
      const device = inject('device')
      const remote = inject('remote')
      const Subscribes = inject('Subscribes')
      const block = ref(false)
      const setMessage = inject('setMessage')
      const channelsList = ref([
         { channel: 'terminal', class: 'btn-outline-light', aclass: 'btn-light', active: false },
         { channel: 'notify', class: 'btn-outline-info', aclass: 'btn-info', active: false },
         { channel: 'event', class: 'btn-outline-info', aclass: 'btn-info', active: false },
         { channel: 'action', class: 'btn-outline-info', aclass: 'btn-info', active: false },
         { channel: 'alert', class: 'btn-outline-warning', aclass: 'btn-warning', active: false },
         { channel: 'error', class: 'btn-outline-danger', aclass: 'btn-danger', active: false },
         { channel: 'render', class: 'btn-outline-success', aclass: 'btn-success', active: false },
      ])
      const shares = ref(false)
      const sharesData = ref({})
      
      const wathing = ref(false)
      return {remote, device, channelsList, Subscribes, block, wathing, shares, sharesData, setMessage }
   },

   methods: {
      toggleChannel(ch, active) {
         if (!active) {
            this.Subscribes.registerChannel(this.$route.params.service, this.$route.params.device, ch, {})
         } else {
            this.Subscribes.unRegisterChannel(this.$route.params.service, this.$route.params.device, ch)
         }
         this.updateChannelList()
      },
      updateChannelList() {
         this.block = true
         for (const chi of this.channelsList) chi.active = false
         this.shares = false
         const list = this.Subscribes.getDeviceRegistered(this.$route.params.service, this.$route.params.device)
         for (const item of list) {
            for (const chi of this.channelsList) {
               if (chi.channel === item.target) {
                  chi.active = true
                  if (chi.channel === 'render') { 
                     this.updateShares()
                     this.shares = true
                  }
                  break
               }
            }
         }
         this.block = false
      },

      async updateShares(){
         try {
            await this.remote.command('serviceShares', { service: this.$route.params.service })
         }catch (e){
            this.setMessage('Ошибка обновления shares данных для этого сервиса ',e.toString(), false, false)
         }
      }
   }
}
</script>
<style></style>