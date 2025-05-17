<template>
    <ul class="panel-nav-list"><slot></slot></ul>
 </template>
 <script>
 
 export default {
    name: 'PanelNavList',
    
 }
 </script>

<style>
.panel-nav-list{
  font-size: 14px;
  padding-right: 15px;
  padding-left: 15px;

  list-style: none;
  margin: 0;
  padding: 0;
  width: auto;
  min-width: 150px;
  /* border-left: solid 4px #fff */
}
</style>