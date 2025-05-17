<template>
  <div class="container">
    <div class="row">
      <form>
        <div class="card col-lg-6 mt-3">
          <h5 class="card-header">
            <span>Edit connection</span>
          </h5>
          <div class="card-body" v-if="form">
            <FormView :model="form" :struct="struct"></FormView>
          </div>
          <div class="card-footer text-body-secondary">
            <button :disabled="saved" @click="addConn()" class="btn btn-primary">Сохранить</button>
            <button :disabled="saved" @click="$router.push('/')" class="btn btn-secondary ms-1">Отмена</button>
            <button :disabled="saved" @click="deleteConn()" class="btn btn-danger ms-1">Удалить</button>
          </div>
          <span class="text-danger">{{ message }}</span>
        </div>
      </form>
    </div>
  </div>
  <!-- {{ this.form }} -->
</template>
<script>
import FormView from '@/components/FormView.vue'
import { inject, ref } from 'vue';
import struct from './form.json'

export default {
  name: 'SettingsView',
  components: { FormView },
  setup() {
    const settings = inject('settings')
    const form = ref(false)
    return { form, settings }
  },

  data: function () {
    return {
      data: {},
      saved: false,
      savedTimeout: false,
      struct: struct,
    }
  },

  mounted() {
    const id = this.$route.params.id
    for (const connect of this.settings.connections) {
      if (connect.id === id) {
        this.form = connect
        break
      }
    }
    if (this.form === false)  this.$router.push('/')
  },

  methods: {
    deleteConn() {
      for (let i = 0; i<  this.settings.connections.length; i++){
        const connect = this.settings.connections[i]
        if (connect.id === this.form.id){
          this.settings.connections.splice(i,1)
        }
      }
      localStorage.settings = JSON.stringify(this.settings);
      this.saved = true;
      this.savedTimeout = setTimeout(() => {
        this.savedTimeout = false;
        this.saved = false;
        this.$router.push('/')
      }, 1000);
    },
    addConn() {
      this.saved = true;
      localStorage.settings = JSON.stringify(this.settings);
      this.savedTimeout = setTimeout(() => {
        this.savedTimeout = false;
        this.saved = false;
        this.$router.push('/')
      }, 1000);
    },
  },
}
</script>