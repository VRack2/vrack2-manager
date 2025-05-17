<template>
    <div class="container">
        <div class="row">
            <form>
                <div class="card col-lg-6 mt-3">
                    <h5 class="card-header">
                        <span>Новый ключ</span>
                    </h5>
                    <div class="card-body">
                        <FormView :model="form" :struct="struct"></FormView>
                    </div>
                    <div class="card-footer text-body-secondary">
                        <button :disabled="saved" @click="addKey()" class="btn btn-success">Добавить ключ</button>
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
import struct from './addForm.json'

export default {
    name: 'SettingsView',
    components: { FormView },
    setup() {
        const form = ref({})
        const settings = inject('settings')
        const remote = inject('remote')
        const getApiKeyList = inject('getApiKeyList')
        const message = ref('')
        return { form, settings, remote, message, getApiKeyList }
    },

    data: function () {
        return {
            data: {},
            saved: false,
            savedTimeout: false,
            struct: struct
        }
    },

    methods: {
        async addKey() {
            this.saved = true;
            let newKey = {}
            try {
                this.form.level = parseInt(this.form.level)
                newKey = await this.remote.command('apiKeyAdd', this.form)
                this.getApiKeyList()
                this.$router.push({name: 'keyView', params:{key: newKey.id}})
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