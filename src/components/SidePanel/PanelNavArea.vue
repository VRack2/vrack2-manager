<template>
    <li class="panel-nav-area">
        <slot></slot>
    </li>
</template>
<script>

export default {
    name: 'PanelNavArea',
    props: ['event', 'active']
}
</script>

<style>
.panel-nav-area {
    font-size: 14px;
    padding-right: 15px;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 0px;
}
</style>