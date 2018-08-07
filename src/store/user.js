import axios from 'axios'
import { UserToken, UserId } from '../storage'

const AUTH_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
const API_KEY = 'AIzaSyByuH0X8m5j6LxvDzsVaUZcaI4DFW6iTlk'

class User {
    constructor (token, userId) {
        this.token = token
        this.userId = userId
    }
}

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
            const url = isSignup ? `${AUTH_URL}/signupNewUser?key=${API_KEY}` : `${AUTH_URL}/verifyPassword?key=${API_KEY}`
            const authData = { email, password, returnSecureToken: true }

            commit('clearError')
            commit('setLoading', true)
            try {
                const { data: { idToken, localId, expiresIn } } = await axios.post(url, authData)
                const expiredDate = parseInt(expiresIn)
                UserToken.set(idToken, expiredDate)
                UserId.set(localId, expiredDate)

                commit('setUser', new User(idToken, localId))
                commit('setLoading', false)
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        },
        authCheckState ({commit}) {
            const token = UserToken.get()
            const userId = UserId.get()

            if (token) {
                commit('setUser', new User(token, userId))
            }
        },
        removeUser ({commit}) {
            UserToken.remove()
            UserId.remove()
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
