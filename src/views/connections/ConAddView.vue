<template>
  <div class="container">
    <div class="row">
      <form>
        <div class="card col-lg-6 mt-3">
          <h5 class="card-header">
            <span>Add new connection</span>
          </h5>
          <div class="card-body">
            <FormView :model="form" :struct="struct"></FormView>
          </div>
          <div class="card-footer text-body-secondary">
            <button :disabled="saved" @click="addConn()" class="btn btn-primary">Add</button>
            <button :disabled="saved" @click="$router.push('/')" class="btn btn-secondary ms-1">Cancel</button>
          </div>
          <span class="text-danger">{{ message }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import FormView from '@/components/FormView.vue'
import { inject, ref } from 'vue';
import struct from './form.json'

export default {
  name: 'SettingsView',
  components: { FormView },
  setup() {
    const form = ref({})
    const settings = inject('settings')
    return { form, settings }
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
    addConn: function () {
      this.saved = true;
      this.form.id = this.makeid(12)
      this.settings.connections.push(this.form)
      localStorage.settings = JSON.stringify(this.settings);
      this.savedTimeout = setTimeout(() => {
        this.savedTimeout = false;
        this.saved = false;
        this.$router.push('/')
      }, 1000);
    },
    makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let counter = 0; counter < length; counter++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },

    toDefault: function () {
      for (const fa of this.struct.blocks) {
        for (const fi of fa.fields) this.form[fi.model] = fi.default;
      }
    },
  },
}
</script>