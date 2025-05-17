import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import FormView from './components/FormView.vue'
import TestFieldView from './components/TestFieldView.vue'
import StructView from './views/action/StructView.vue'
import JSONView from './components/JSONView.vue'
import ObjectView from './components/ObjectView.vue'

createApp(App).use(router)
.component('FormView', FormView)
.component('TestFieldView', TestFieldView)
.component('JSONView', JSONView)
.component('ObjectView', ObjectView)
.component('ActionStructView', StructView)
.mount('#app')
