import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Cars from '../views/Cars.vue'
import Car from '../views/Car.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: '/Dashboard',
    component: Dashboard
  },
  {
    path: '/cars',
    name: '/Cars',
    component: Cars
  },
  {
    path: '/car/:id',
    name: 'car',
    component: Car
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
