<template>
  <div class="alert p-1 m-0 alert-light rounded-0 border-0 border-bottom">
    <div class="d-flex flex-row  align-items-center">
      <div class="card-title">
        <div v-if="message.primarySpinner" class="spinner-grow spinner-grow-sm text-danger ms-2 me-2" role="status"></div>
        {{message.message}}
        <button class="btn btn-link btn-sm" @click="toggleSpoiler()">развернуть <i class="bi bi-arrow-down"></i></button>
        <button class="btn btn-link btn-sm" @click="hideMessage()">Закрыть <i class="bi bi-x"></i></button>
        <div v-if="spoiler">
          <small>{{ message.subMessage }}</small></div>
        </div>
    </div>
  </div>

  </template>
  
  <script>
  export default {
    name: "message-app",
    props: ['message', 'hideMessage'],
    data: function(){
      return { spoiler: true }
    }, 
    methods: {
      toggleSpoiler(){
        this.spoiler = !this.spoiler
      }
    }
  };
  </script>
  