<template>
  <!-- {{ rule }} == -->
  <template v-if="rule !== undefined">
    <span><span v-if="rule.require">*</span><i>{{ rule.type }}</i><span v-if="rule.default"> = {{ rule.default
        }}</span></span>
    <small class="form-text text-muted"> - {{ rule.description }}</small>
    <!-- {{ subArray }} -->
    <div class="ms-3" v-if="subArray">
      contain []: <ActionStructView  :rule="subArray"></ActionStructView>
    </div>
    <div class="ms-3" v-if="subObject">
      <div v-for="(act, idx) in subObject" :key="'act-struct-sub' + idx"> 
        <b>{{ idx }}</b> : <ActionStructView  :rule="act"></ActionStructView>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  props: ["rule"],
  name: 'StructView',
  setup(props) {
    let subArray = undefined
    let subObject = undefined
    if (!props.rule.rules) return {subArray, subObject}
    for (const srule of props.rule.rules) {
      switch (srule.name) {
        case "contain":
          subArray = srule.args
          break
        case "fields":
          subObject = srule.args
          break
      }
    }
    return { subArray, subObject }
  },

  watch: {
    rule: function (){
      if (!this.rule.rules) return
      for (const srule of this.rule.rules) {
        switch (srule.name) {
          case "contain":
            this.subArray = srule.args
            break
          case "fields":
            this.subObject = srule.args
            break
        }
      }
    }
  }
}
</script>