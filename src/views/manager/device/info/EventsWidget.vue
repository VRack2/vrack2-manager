<template>
    <div class="card mt-2">
        <div class="card-header d-flex align-items-center justify-content-between">
            События
            <div>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" title="Запуск просмотра событий" :disabled="flagPlay" @click="flagPlay = true" class="btn btn-dark"><i class="bi bi-play-circle-fill"></i></button>
                    <button type="button" title="Остановка просмотра событий" :disabled="!flagPlay" @click="flagPlay = false" class="btn btn-dark"><i class="bi bi-pause-circle-fill"></i></button>
                    <button type="button" title="Удаление событий" @click="clearMessage()" class="btn btn-dark"><i class="bi bi-trash3-fill"></i></button>
                </div>
                <div class="btn-group ms-3" role="group" aria-label="Basic example">
                    <button type="button" :class="{ active: flagExpand }" @click="toggleExpand()"  title="Развернуть все" class="btn btn-dark"><i class="bi bi-plus-circle-fill"></i></button>
                    <button type="button" :class="{ active: flagCollaps }" @click="toggleCollaps()" title="Свернуть все" class="btn btn-dark"><i class="bi bi-dash-circle-fill"></i></button>
                    <button type="button" :class="{ active: flagFullInfo }" @click="flagFullInfo = !flagFullInfo" title="Показывать всю информацию" class="btn btn-dark"><i class="bi bi-card-text"></i></button>
                </div>
                <div>

                </div>
            </div>
            <div>
                <div class="row g-2 align-items-center">
                    <div class="col-auto">
                        <label class="col-form-label">Количество событий:</label>
                    </div>
                    <div class="col-auto">
                        <select class="form-select" @change="filterMessage()" v-model="showMax">
                            <option :value="15">15</option>
                            <option :value="30">30</option>
                            <option :value="60">60</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <span :class="{'loader-progress-animation': flagPlay}" class="loader-progress"></span>
        <ul class="list-group list-group-flush">            
            <EventWidget v-for="event of messages" :flagCollaps="flagCollaps" :flagExpand="flagExpand" :flagFullInfo="flagFullInfo" :key="event.id" :event="event"></EventWidget>
        </ul>
        <!-- <div class="card-body" v-if="messages.length">
            {{ lastIndex }}
            {{ messages }}
        </div> -->
    </div>
</template>
<script>
import { inject, provide, ref, watch } from 'vue';
import EventWidget from './EventWidget.vue';


export default {
    name: 'EventsWidget',
    props: ['service', 'device'],
    components: { EventWidget },
    setup() {
        const Subscribes = inject('Subscribes')
        const flagPlay = ref(true)
        const flagExpand = ref(false)
        const flagCollaps = ref(false)
        const flagFullInfo = ref(false)
        const messages = ref([])
        provide('eventsFlags', {flagExpand, flagCollaps, flagFullInfo})
        const showMax = 15
        const lastIndex = false;
        return { Subscribes, flagPlay, flagExpand, flagCollaps, messages, lastIndex, showMax, flagFullInfo}
    },

    mounted() {
        watch (this.Subscribes.messages, () => {
            this.filterMessage()
        })
        this.filterMessage()
    },

    watch: {
        service: function (){
            this.filterMessage()
        },
        device: function(){
            this.filterMessage()
        }
    },

    methods:{
        clearMessage(){
            if (!this.messages.length) return
            this.lastIndex = this.messages[0].id
            this.messages.splice(0, this.messages.length)
            this.filterMessage()
        },

        filterMessage(){
            if (!this.flagPlay) return
            this.messages.splice(0, this.messages.length)
            let sh = 0;
            for (let i = this.Subscribes.messages.length - 1; i > 0; i--){
                if (this.lastIndex && this.Subscribes.messages[i].id <= this.lastIndex) continue
                const msg = this.Subscribes.messages[i]
                if (this.service && this.device){
                    if (this.service !== msg.service ||  this.device !== msg.device ) continue
                    this.messages.push(msg)
                }else{
                    this.messages.push(msg)
                }
                sh++
                if (sh >= this.showMax) break
            }
        },

        toggleExpand(){
            this.flagExpand = !this.flagExpand
            this.flagCollaps = false
        },
        toggleCollaps(){
            this.flagCollaps = !this.flagCollaps
            this.flagExpand = false
        }
    }
}
</script>

<style scoped>
.loader-progress {
  width: 100%;
  height: 6px;
  display: inline-block;
  background-color: #9A6D45;
  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.25) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.25) 75%, transparent 75%, transparent);
  font-size: 30px;
  background-size: 1em 1em;
  box-sizing: border-box;
}

.loader-progress-animation {
  animation: barStripe 3s linear infinite;
}

@keyframes barStripe {
  0% {
    background-position: 1em 0;
  }
  100% {
    background-position: 0 0;
  }
}

</style>