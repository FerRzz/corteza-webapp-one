import Auth from '@/client/api/auth'

import config from '@/api/config'
import store from '@/store'

const client = new Auth(config.endpoints.auth || 'https://auth.api.latest.rustbucket.io', store.getters['auth/jwt'])

export default client
