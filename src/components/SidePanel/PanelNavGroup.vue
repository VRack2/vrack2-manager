<template>
   <p class="panel-nav-group m-0 p-2">
      <slot></slot>
   </p>
</template>
<script>

export default {
   name: 'PanelNavGroup',
}
</script>

<style>
.panel-nav-group {
   font-size: 13px;
   font-weight: bold;
   /* text-decoration: underline; */
   color: #fff;
   background-color: #4e4745;
   -webkit-box-shadow: 0px 7px 5px -5px rgba(34, 60, 80, 0.6);
   -moz-box-shadow: 0px 7px 5px -5px rgba(34, 60, 80, 0.6);
   box-shadow: 0px 7px 5px -5px rgba(34, 60, 80, 0.6);
}
</style>