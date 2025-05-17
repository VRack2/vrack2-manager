<template>
    <div class="container-fluid">
      <CommandWidget :command="command" :expand="true"></CommandWidget>
    </div>
  </template>
  <script>
  import { inject, ref } from 'vue';
  import { markdown } from 'markdown';
import CommandWidget from './CommandWidget.vue';
  

  export default {
    name: 'ManagerIndexView',
    components: { CommandWidget  },
    setup() {
      const remote = inject('remote')
      const command = ref(false)
      return { remote, command, markdown }
    },

    beforeRouteUpdate(to, from,next){
      // this.updateCommand(to.params)
      if (to.params.command) this.command = this.remote.commandsList[to.params.command]
      next()
    },

    mounted: function (){
      this.updateCommand()
    },

    methods: {
      updateCommand(){
        if (this.$route.params.command) this.command = this.remote.commandsList[this.$route.params.command]
      }
    }
  }
  </script>