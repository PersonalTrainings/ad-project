import * as firebase from 'firebase'

export default {
    state: {
        user: null
    },
    mutations: {
        setUser (state, payload) {
            const oneHour = 1 * 60 * 60 * 1000
            const expirationDate = +(new Date(+oneHour + Date.now()))

            localStorage.setItem('userToken', payload)
            localStorage.setItem('expirationDate', expirationDate)
            state.user = payload
        },
        removeUser (state) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('expirationDate')
            state.user = null
        }
    },
    actions: {
        async registerUser ({commit}, {email, password}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                const { user: { uid } } = await firebase.auth().createUserWithEmailAndPassword(email, password)
                commit('setUser', uid)
                commit('setLoading', false)
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        },
        async loginUser ({commit}, {email, password}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                const { user: { uid } } = await firebase.auth().signInWithEmailAndPassword(email, password)
                commit('setUser', uid)
                commit('setLoading', false)
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        },
        authCheckState ({commit}) {
            const token = localStorage.getItem('userToken')
            if (!token) {
                commit('removeUser')
            } else {
                const expirationDate = localStorage.getItem('expirationDate')
                if (new Date(expirationDate) < Date.now()) {
                    commit('removeUser')
                } else {
                    commit('setUser', token)
                }
            }
        },
        removeUser ({commit}) {
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
