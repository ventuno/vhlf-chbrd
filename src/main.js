import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './Home.vue'
import Board from './Board.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/board', component: Board },
]

const router = new VueRouter({
  routes,
})

new Vue({
  router: router,
}).$mount('#app');
