<template>
    <div class="container">
        <div class="row">

            {{ this.$route.params.key }}
            <form>
                <div class="card col-lg-6 mt-3">
                    <h5 class="card-header">
                        <span>Новый ключ</span>
                    </h5>
                    <div class="card-body">
                        <FormView :model="form" :struct="struct"></FormView>
                    </div>
                    <div class="card-footer text-body-secondary">
                        <button :disabled="saved" @click="updateKey()" class="btn btn-warning">Обновить данные</button>
                    </div>
                    <span class="text-danger">{{ message }}</span>
                </div>
            </form>
            <!-- {{ getApiKeyList }} -->
        </div>
    </div>
</template>
<script>
import FormView from '@/components/FormView.vue'
import { inject, ref } from 'vue';
import struct from './editForm.json'

export default {
    name: 'SettingsView',
    components: { FormView },
    setup() {
        const form = ref({})
        const settings = inject('settings')
        const remote = inject('remote')
        const getApiKeyList = inject('getApiKeyList')
        const keyList = inject('keyList')
        const message = ref('')
        return { form, settings, remote, message, getApiKeyList, keyList }
    },

    data: function () {
        return {
            data: {},
            saved: false,
            savedTimeout: false,
            struct: struct
        }
    },


    mounted () {
        let key = {}
        for (const tKey of this.keyList) if (this.$route.params.key === tKey.id) key = tKey
        this.form['name'] = key.name
        this.form['description'] = key.description
    },
    methods: {
        updateForm(){

        },

        async updateKey() {
            this.saved = true;
            try {
                this.form.id = this.$route.params.key
                await this.remote.command('apiKeyUpdate', this.form)
                this.getApiKeyList()
                this.$router.push({name: 'keyView', params:{ key:this.$route.params.key }})
            }catch (error){
                this.message = error.toString()
            }
            this.savedTimeout = setTimeout(() => {
                this.savedTimeout = false;
                this.saved = false;
            }, 1000);
        },
    },
}
</script>