<template>
   <div class="p-3" style="font-weight: bold;"><img v-if="img" :src="img" width="60"> <span class="ms-2"><slot></slot></span> </div>
</template>
<script>

export default {
   name: 'PanelHeader',
   props: ['img'],
}
</script>