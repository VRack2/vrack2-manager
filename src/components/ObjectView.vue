<template>
    <div v-if="typeof data === 'object' && data !== null">
        <span class="ob-key">
             <span v-if="!root">{{ field }}:&nbsp;</span>{
        </span>
        <div class="ms-4">
            <ObjectView v-for="(val, idx) of data" :key="field+'-'+idx" :data="val" :field="idx"></ObjectView>
        </div>
        }
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
</template>
      
<script>
export default {
    props: ['root','field','data'],
    mounted (){
        if (typeof this.data ==='object' && this.data !== null && Object.keys(this.data).length < 10){
            this.show=true
        }

    },
    data (){
        return { show: false }
    }
};
</script>
    
<style scoped>
.ob-key {
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
  white-space: nowrap;
  padding: 0px;
}
</style>