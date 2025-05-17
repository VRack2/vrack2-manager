<template>
    <template v-if="ready">
    <div class="container-fluid">
        <div v-for="(command, name) of apis" :key="name">
            <CommandWidget :command="command"></CommandWidget>
        </div>
    </div>
    </template>
</template>

<script>
import { ref } from 'vue'
import { inject } from 'vue'
import CommandWidget from '../api/CommandWidget.vue'


export default {
    name: 'ServiceApiView',

    setup() {
        const service = inject('service')
        const ready = ref(false)
        const remote = inject('remote')
        const setMessage = inject('setMessage')
        const block = ref(false)
        const apis = ref({});
        return { service, remote, block, setMessage, ready,apis }
    },

    mounted() {
        this.updateServiceApis()
    },
    components: { CommandWidget },

    methods: {
        async updateServiceApis() {
            if (this.service.id && this.service.run) {
                this.apis = await this.remote.command('serviceCommandsList', { 
                    service: this.service.id 
                })
                this.ready = true
            }
        },
    }
}
</script>

<style scoped></style>