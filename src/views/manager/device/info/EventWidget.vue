<template>
    <li class="list-group-item p-0">
        <div class="p-2 d-flex justify-content-between">
            <div class="event-header" @click="collaps = !collaps">
                <span class="text-secondary">services</span>.<span class="text-warning-emphasis">{{ event.service }}</span>.<span class="text-secondary">devices</span>.<span class="text-info">{{ event.device }}</span>.<span class="text-light">{{ event.target }}</span>:
                {{ event.data.data.message }}
            </div>
            <div>#{{ event.id }} {{ moment(event.timestamp).calendar() }}</div>
        </div>
        <div class="event-trace p-2" v-if="(collaps && !flagCollaps ) || flagExpand" >
            <ObjectView v-if="!flagFullInfo" field="root" :root="true" :data="event.data.data.trace"></ObjectView>
            <ObjectView v-if="flagFullInfo" field="root" :root="true" :data="event.data"></ObjectView>
        </div>
    </li>
</template>
<script>
import moment from 'moment';
import { inject, ref } from 'vue';

moment.locale('ru')

export default {
    name: 'EventWidget',
    props: ['event'],
    setup (){
        const flags = inject('eventsFlags')
        const collaps = ref(false);
        return { moment,collaps, flagExpand: flags.flagExpand, flagCollaps: flags.flagCollaps, flagFullInfo: flags.flagFullInfo }
    },

    methods: {

    }
}
</script>
<style scoped>
.event-trace{
    background-color: #181a1f;
}
.event-header{
    cursor: pointer;
}

</style>