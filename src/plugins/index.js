import Vue from 'vue'

import system from '@/plugins/system'
import messaging from '@/plugins/messaging'
import logger from '@/plugins/logger'
import auth from 'crust-common.vue/src/plugins/auth'

Vue.use(logger)
Vue.use(system)
Vue.use(messaging)
Vue.use(auth)
