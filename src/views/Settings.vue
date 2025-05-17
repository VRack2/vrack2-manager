<template>
  <div class="container">
    <div class="row">
      <form>
        <div class="card col-lg-6 mt-3">
          <h5 class="card-header">
            <span>Настройки</span>
          </h5>
          <div class="card-body">
            <FormView :model="form" :struct="struct"></FormView>
          </div>
          <div class="card-footer text-body-secondary">
            <button :disabled="saved" @click="saveSettings()" class="btn btn-primary">Сохранить</button>
            <button :disabled="saved" @click="$router.push('/')" class="btn btn-secondary ms-1">Отмена</button>
            <button :disabled="saved" @click="toDefault()" class="btn btn-secondary ms-1">По умолчанию</button>
          </div>
          <span class="text-danger">{{ message }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import FormView from '@/components/FormView.vue'
import { ref } from 'vue';

export default {
  name: 'SettingsView',
  components: { FormView },
  setup() {
    const form = ref({})
    return { form }
  },

  mounted() {
    if (localStorage.settings) {
      try {
        Object.assign(this.form, JSON.parse(localStorage.settings))
      } catch (err) {
        this.toDefault();
      }
    } else {
      this.toDefault();
    }
  },

  data: function () {
    return {
      data: {},
      saved: false,
      savedTimeout: false,
      struct: {
        blocks: [
          {
            label: "Подключение",
            fields: [
              {
                type: "text",
                model: "address",
                label: "Адрес VRack",
                default: "ws://127.0.0.1:4044/",
                description: "Адрес для доступа к VRack",
              },
              {
                type: "text",
                model: "secret",
                label: "Secret key",
                default: "default",
                description: "Публичный ключ для доступа к VRack",
              },
              {
                type: "text",
                model: "private",
                label: "Private key",
                default: "",
                description: "Приватный ключ доступа для шифрования",
              },
            ],
          },
        ],
      },
    }
  },

  methods: {
    saveSettings: function () {
      this.saved = true;
      localStorage.settings = JSON.stringify(this.form);
      if (this.savedTimeout) clearTimeout(this.savedTimeout);
      this.savedTimeout = setTimeout(() => {
        this.savedTimeout = false;
        this.saved = false;
        this.$router.push('/')
      }, 1000);


    },
    toDefault: function () {
      for (const fa of this.struct.blocks) {
        for (const fi of fa.fields) this.form[fi.model] = fi.default;
      }
    },
  },
}
</script>