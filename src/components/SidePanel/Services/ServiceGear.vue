<template>

    <i 
        :class="{
            'bi-gear-fill': (!errors),
            'bi-exclamation-octagon-fill': (errors),
            'text-secondary': (!errors && !run),
            'text-success': (!errors && run),
            'text-danger': (errors)
        }"
        style="font-size: 15px; font-weight:800; margin-right: 5px;" 
        class="bi ">
    </i>
 </template>
 <script>
 
 export default {
    name: 'PanelHeader',
    props: ['errors', 'run'],
 }
 </script>