<template>
    <div v-if="typeof data === 'object' && data !== null">
        <span class="data-key" @click="show = !show ">
            <i v-if="!show" class="bi bi-chevron-right me-1"></i>
            <i v-if="show" class="bi bi-chevron-down me-1"></i>
             {{ field }}: {{ Object.keys(data).length }} elements
        </span>
        <div class="ms-5" v-if="show">
            <JSONView v-for="(val, idx) of data" :key="field+'-'+idx" :data="val" :field="idx"></JSONView>
        </div>
    </div>
    <!-- string -->
    <div v-if="typeof data === 'string'">{{ field }}: <span style="color:#37ae6f">'{{ data }}'</span></div>
    <div v-if="typeof data === 'symbol'">{{ field }}: <span style="color:#37ae6f">'{{ data }}'</span></div>
    <!-- numbers -->
    <div v-if="typeof data === 'number'">{{ field }}: <span style="color:#d26d32">{{ data }}</span></div>
    <div v-if="typeof data === 'bigint'">{{ field }}: <span style="color:#d26d32">{{ data }}</span></div>
    <!-- boolean  -->
    <div v-if="typeof data === 'boolean'">{{ field }}: <span style="color:#c40065">{{ data }}</span></div>
    <!-- undefined -->
    <div v-if="typeof data === 'undefined'">{{ field }}: <span style="color:#c13838">undefined</span></div>
    <div v-if="typeof data === 'object' && data === null">{{ field }}: <span style="color:#c13838">null</span></div>

    <!-- <pre class="">{{ data }}</pre> -->
</template>
      
<script>
export default {
    props: ['root','field','data', 'expand'],
    mounted (){
        if (this.data !== null && typeof this.data ==='object' && Object.keys(this.data).length < 10){
            this.show=true
        }
        if (this.root) this.show = true
        if (this.expand){ this.show = true }
    },
    data (){
        return { show: false }
    }
};
</script>
    
<style scoped>
.data-key {
  font-size: 100%;
  font-family: inherit;
  border: 0;
  padding: 0;
  background-color: transparent;
  width: 100%;
  color: var(--vjc-key-color);
  display: flex;
  align-items: center;
  border-radius: 2px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  padding: 5px;
}
</style>