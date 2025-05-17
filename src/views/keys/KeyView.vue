<template>
    <div class="container-fluid">
        <div class="card mt-3" v-if="key">
            <div class="card-body d-flex justify-content-between">
                <h3>{{ key.name }}</h3>
                <h3><LevelBadge :level="key.level"></LevelBadge></h3>
            </div>
            <div class="card-body">
                <p>{{ key.description }}</p>
                <h5>Access key</h5>
                <pre class="rounded p-3 key-block-pre">{{ key.key }}</pre>
                <template v-if="key.private">
                    <h5 >Private <Keygen></Keygen></h5>
                    <pre class="rounded p-3 key-block-pre">{{ key.private }}</pre>
                </template>
            </div>
            <div class="card-body text-danger" v-if="message">
                {{ message }}
            </div>
            <div class="card-footer">
                <button type="button" @click="toUpdate()" class="btn btn-primary">Изменить</button>
                <button type="button" v-if="!toDelete" @click="toDelete = true" class="ms-3 btn btn-danger">Удалить?</button>
                <button type="button" v-if="toDelete" @click="toDelete = false" class="ms-3 btn btn-success">Отмена</button>
                <button type="button" v-if="toDelete" @click="actionDelete()" class="ms-3 btn btn-danger">УДАЛИТЬ!</button>
            </div>
        </div>
    </div>
</template>
<script>
import { inject, ref } from 'vue';
import LevelBadge from '../api/LevelBadge.vue';

export default {
    name: 'ManagerIndexView',
    components: { LevelBadge },
    setup() {
        const remote = inject('remote')
        const keyList = inject('keyList')
        const getApiKeyList = inject('getApiKeyList')
        const key = ref(false)
        const toDelete = ref(false)
        const message = ref('')
        return { remote, keyList, key, toDelete, getApiKeyList, message }
    },

    beforeRouteUpdate(to, from, next) {
        if (to.params.key) for (const key of this.keyList) { if (key.id === to.params.key) this.key = key }
        next()
    },

    watch: {
        'keyList': function (){
            this.updateKey()
        }
    },

    mounted: function () {
        this.updateKey()
    },

    methods: {

        toUpdate(){
            this.$router.push({name: 'keyUpdate', params: {key: this.key.id }})
        },

        async actionDelete(){
            try {
                await this.remote.command('apiKeyDelete', {id: this.key.id })
                this.getApiKeyList()
                this.$router.push({name: 'keyManager'})
            }catch (error){
                this.message = error.toString()
            }
        },
        updateKey() {
            if (this.$route.params.key) {
                for (const key of this.keyList) { if (key.id === this.$route.params.key) this.key = key }
                return
            }
            this.key = false
        }
    }
}
</script>
<style scoped>
.key-block-pre {
  display: block;
  white-space: pre;
  background-color: #1b1b1b;
  border: 1px solid #794b07;
}
</style>