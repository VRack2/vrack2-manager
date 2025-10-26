<template>
  <div class="card mt-3" v-if="command">
    <div class="card-body d-flex justify-content-between justify-content-center">
      <h4 class="mb-0" :class="{'my-link': !expand }" @click="toggleExp()">
        <b class="me-2 ms-2"><i v-if="!command.icon" class="bi bi-command"></i><i v-if="command.icon"
            :class="'bi-' + command.icon" class="bi"></i></b>
        <span class="text-secondary">{{ command.owner }}.</span><span class="text-info">{{ command.command }}</span>
      </h4>
      <h4  class="mb-0">
        <LevelBadge :level="command.level"></LevelBadge>
      </h4>
    </div>
    <div class="card-body" v-if="exp">
      <h4 v-if="command.description">Описание</h4>
      <p v-if="command.description" v-html="Marked.parse(command.description)"></p>
      <h4 class="mt-4" v-if="command.rules && Object.keys(command.rules).length">Параметры запроса</h4>
      <div class="ms-4" v-for="(rule, index) in command.rules" :key="command.command + index">
        <b>{{ index }}</b> - <ActionStructView :rule="rule"></ActionStructView>
      </div>
      <h6 class="mt-3">Пример запроса</h6>
      <pre class="border rounded mt-3 p-3 bg-secondary-subtle">{{ actE }}</pre>
      <h4 class="mt-4" v-if="command.return">Возвращает</h4>
      <ActionStructView v-if="command.return" :key="command.command" :rule="command.return"></ActionStructView>
      <h6 class="mt-3">Пример возвращаемого значения</h6>
      <pre class="border rounded mt-3 p-3 bg-secondary-subtle">{{ retE }}</pre>
      <!-- <RuleExampleWidget :rule="command.return"></RuleExampleWidget> -->
    </div>
  </div>
</template>
<script>
import LevelBadge from './LevelBadge.vue';
import { inject, ref } from 'vue';
// import RuleExampleWidget from '@/components/RuleExampleWidget.vue';
import { Utility } from '@/classes/Utility';

export default {
  name: 'ManagerIndexView',
  props: ['command', 'expand'],
  components: { LevelBadge, 
    // RuleExampleWidget 
  },
  setup() {
    const exp = ref(false)
    const retE = ref({})
    const actE = ref({})
    const Marked = inject('Marked')
    return { exp, retE, actE, Marked }
  },

  watch: {
    command: function (){
      this.updateExamples()
    }
  },

  mounted() {
    this.exp = this.expand
    this.updateExamples()
  },
  methods: {
    toggleExp(){
      if (this.expand) return
      this.exp = !this.exp
    },
    updateExamples(){
      this.retE = null
      this.actE =  {
        command: this.command.command,
        data: Utility.ruleObject(this.command.rules)
      }
      if (this.command.return) this.retE = Utility.getRuleValue(this.command.return)
    }
  }
}
</script>