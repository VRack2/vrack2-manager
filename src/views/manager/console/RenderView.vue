<template>
    <div>
       <template v-for="(devList, serv) in  Subscribes.shares" :key="serv + 'serv'">
        <div v-if="Object.keys(devList).length" class="card mt-2" style="" >
            <div class="card-header"><span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ serv }}</span>.<span class="text-secondary">devices:</span></div>
            <div class="card-body p-2" style="background-color: #181a1f;">
                <JSONView v-for="(sh, dev) in devList" :field="dev" :key="serv + dev" :root="true" :data="sh"></JSONView>
            </div>
        </div>
            
       </template> 
    </div>
    <!-- <div class="card mt-2" style="" >
        <div class="card-header">Данные</div>
        <div class="card-body p-2" style="background-color: #181a1f;">
            <JSONView field="root" :root="true" :data="Subscribes.shares"></JSONView>
        </div>
    </div> -->
  </template>
  <script>
  import { inject, watch } from 'vue';
  export default {
    name: 'RenderView',
    components: {},
    setup() {
        const Subscribes = inject('Subscribes')
        return {Subscribes }
    },
    mounted (){
        watch (this.Subscribes.render, ()=>{
            this.updateTree()
        })
        this.updateTree()
    },
    methods: {
        updateTree(){

        }
    }
  }
  </script>


<style>
.h100{
    height: 100%;
}


</style>