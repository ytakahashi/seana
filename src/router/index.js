import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/image',
      name: 'image',
      component: require('@/components/DockerImages').default
    },
    {
      path: '/container',
      name: 'container',
      component: require('@/components/DockerContainers').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
