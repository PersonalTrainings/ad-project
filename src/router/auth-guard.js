import store from '../store'

export default function (to, from, next) {
    setTimeout(() => {
        if (store.getters.user) {
            next()
        } else {
            next('/login?loginError=true')
        }
    }, 0)
}
