import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/components/Panel'
import LiveConfig from '@/components/LiveConfig'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/panel',
      name: 'Panel',
      component: Panel
    },
    {
      path: '/live_config',
      name: 'LiveConfig',
      component: LiveConfig
    },

  ]
  // ,
  // mode: 'history'
})
