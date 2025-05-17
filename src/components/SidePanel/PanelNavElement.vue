<template>
    <li class="panel-nav-element"
        v-on:click="event"
        v-bind:class="{ 'panel-nav-element-active': active }">
        <slot></slot>
    </li>
</template>
<script>

export default {
    name: 'PanelNavElement',
    props: ['event', 'active']
}
</script>

<style>
.panel-nav-element {
    font-size: 14px;
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 0px;
    /* background-color: #212529; */
    border-right: #794b07 1px solid;
    /* border-left:rgb(202, 229, 255) 3px solid; */
}


.panel-nav-element-active{
  /* background-color: rgb(57, 57, 57)!important; */
  border-right: #ecbd76 5px solid;
}

.panel-nav-element:hover{
  cursor: pointer;
  background-color: #131313!important;
}
</style>