<template>
    <span style="display: block;" class="">
            <i v-if="run" style="font-size: 15px; color: #67C23A; font-weight:800; margin-right: 5px;" class="bi bi-gear-fill"></i>
            <i v-if="errors" style="font-size: 15px; color: #F56C6C; font-weight:800; margin-right: 5px;" class="bi bi-gear-fill"></i>
            {{serviceName}}
    </span>
    <small style="color: #AAA"><b>{{ serviceId }}</b></small>
 </template>
 <script>
 export default {
    name: 'PanelNav',
    props: [ 'serviceName', 'serviceId', 'run', 'errors' ],
 }
 </script>