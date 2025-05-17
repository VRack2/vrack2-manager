<template>
  <div class="container">
    <div class="row">
      <form>
        <div class="card  mt-3">
          <h5 class="card-header">
            <span>Экспорт соединений</span>
          </h5>
          <div class="card-body" v-if="form">
            <FormView :model="form" :struct="struct"></FormView>
          </div>
          <div class="card-footer text-body-secondary">
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
    const form = ref({ settings: JSON.stringify(settings.value) })

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
                "label": "Скопируйте текст в поле",
                "default": "",
                "description": "Для переноса скопируйте текст в поле вышеи и вставьте в поле импорта в другом браузере"
              }
            ]
          }
        ]
      },
    }
  },
}
</script>