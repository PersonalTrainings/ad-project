import * as firebase from 'firebase'
import { UserToken } from '../storage'

export default {
    state: {
        user: null
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        removeUser (state) {
            state.user = null
        }
    },
    actions: {
        async authUser ({commit}, {email, password, isSignup = false}) {
            const method = isSignup ? 'createUserWithEmailAndPassword' : 'signInWithEmailAndPassword'
            // one hour
            const expirationDate = 1 * 60 * 60

            commit('clearError')
            commit('setLoading', true)
            try {
                const { user: { uid } } = await firebase.auth()[method](email, password)
                UserToken.set(uid, expirationDate)

                commit('setUser', uid)
                commit('setLoading', false)
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        },
        authCheckState ({commit}) {
            const token = UserToken.get()

            if (token) {
                commit('setUser', token)
            }
        },
        removeUser ({commit}) {
            UserToken.remove()
            commit('removeUser')
        }
    },
    getters: {
        user (state) {
            return state.user
        },
        isUserLoggedIn (state) {
            return state.user !== null
        }
    }
}
