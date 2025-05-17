<template>
    <div class="container">
      <div class="row">
        <form>
          <div class="card  mt-3">
            <h5 class="card-header">
              <span>Импорт соединений</span>
            </h5>
            <div class="card-body" v-if="form">
              <FormView :model="form" :struct="struct"></FormView>
            </div>
            <div class="card-footer text-body-secondary">
              <button :disabled="block" @click="saveSettings()" class="btn btn-warning">Сохранить</button>
              <button :disabled="block" @click="$router.push('/')" class="btn btn-secondary ms-1">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  <script>
  import FormView from '@/components/FormView.vue'
  import { inject, ref } from 'vue';
  
  export default {
    name: 'SettingsView',
    components: { FormView },
    setup() {
      const settings = inject('settings')
      const form = ref({ settings: "" })
      return { form, settings,  }
    },
  
    data: function () {
      return {
        block: false,
        struct: {
          "blocks": [
            {
              "label": "Подключения",
              "fields": [
                {
                  "type": "textarea",
                  "model": "settings",
                  "label": "Вставьте текст настроек в поле",
                  "default": "",
                  "description": "Вставьте текст настроек в поле выше и обязательно нажмите сохранить для сохранение конфигурации"
                }
              ]
            }
          ]
        },
      }
    },

    methods: {
      saveSettings(){
        
        const obj = JSON.parse(this.form.settings)
        if (obj.connections) this.settings.connections = obj.connections
        localStorage.settings = JSON.stringify(this.settings);
        this.block = true
        setTimeout(() => {
          this.block = false;
          this.$router.push('/')
        }, 1000);
      }
    }
  }
  </script>