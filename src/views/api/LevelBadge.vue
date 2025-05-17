<template>
    <span class="badge" :class="command">Level {{ level }}</span>
</template>
<script>  
export default {
    name: 'LevelBadge',
    props: ['level'],
    components: {},
    watch: {
        level: function (){
            this.command = this.rebuild()
        }
    },
    data: function (){
        return { command:this.rebuild() }
    },
    methods:{
        rebuild(){
            let tmp = 'text-bg-light'
            if (this.level === 3) tmp = 'text-bg-info'
            if (this.level === 2) tmp = 'text-bg-warning'
            if (this.level === 1) tmp = 'text-bg-danger'
            return tmp
        }
    }
 }
</script>