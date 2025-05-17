<template>
  <div class="card">
    <div class="card-header">{{ header }}</div>
    <div class="card-body">
      <table class="table"> 
        <tbody><tr v-for="param in params" :key="param.name"><td>{{ param.label }}</td><td>{{ value[param.name] }}</td></tr></tbody>
      </table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'PanelListWidget',
  props: ['value', 'params', 'header'],
  setup() {
    return {}
  }
}
</script>

<style></style>