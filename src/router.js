import { createRouter, createWebHistory } from "vue-router";

import Home from '~/pages/Home.vue'

const router = createRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home
    }
  ],
  history: createWebHistory()
});


export { router }