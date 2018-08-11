import * as firebase from 'firebase'

class Order {
    constructor (name, phone, adId, done = false, id = null) {
        this.name = name
        this.phone = phone
        this.adId = adId
        this.done = done
        this.id = id
    }
}

export default {
    state: {
        orders: []
    },
    mutations: {
        loadOrders (state, payload) {
            state.orders = payload
        }
    },
    actions: {
        async createOrder ({commit}, {name, phone, adId, ownerId}) {
            const order = new Order(name, phone, adId)
            commit('clearError')

            try {
                await firebase.database().ref(`/users/${ownerId}/orders`).push(order)
            } catch (err) {
                commit('setError', err.message)
                throw err
            }
        },
        async fetchOrders ({commit, getters}) {
            commit('clearError')
            commit('setLoading', true)
            const resultOrders = []

            try {
                const fbVal = await firebase.database().ref(`users/${getters.user.id}/orders`).once('value')
                const orders = fbVal.val()

                for (let key in orders) {
                    const o = orders[key]
                    resultOrders.push(
                        new Order(o.name, o.phone, o.adId, o.done, key)
                    )
                }

                commit('loadOrders', resultOrders)
                commit('setLoading', false)
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        },
        async markOrderDone ({commit, getters}, {orderId, done}) {
            commit('clearError')
            try {
                await firebase.database().ref(`users/${getters.user.id}/orders`).child(orderId).update({
                    done
                })
            } catch (err) {
                commit('setError', err.message)
                throw err
            }
        }
    },
    getters: {
        doneOrders (state) {
            return state.orders.filter(o => o.done)
        },
        undoneOrders (state) {
            return state.orders.filter(o => !o.done)
        },
        orders (state, getters) {
            return getters.undoneOrders.concat(getters.doneOrders)
        }
    }
}
