<template>
  <div class="map-modal-overlay">
    <div class="map-modal">
      <Scheme :devices="structure" :actions="actions"></Scheme>
    </div>
  </div>
</template>
<script>
import Scheme from './scheme/Scheme.vue'
export default {
  name: 'ManagerIndexView',
  props: ['structure','actions'],
  components: { Scheme },
}
</script>
<style>
.map-modal-overlay {
  position: fixed;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.map-modal {
  text-align: center;
  /* background-color: white; */
  height: 95%;
  width: 95%;
  margin-top: 1%;
  /* padding: 60px 0; */
  /* border-radius: 20px; */
}
</style>