import * as firebase from 'firebase'

class Ad {
    constructor (title, description, ownerId, imageSrc = '', promo = false, id = null) {
        this.title = title
        this.description = description
        this.ownerId = ownerId
        this.imageSrc = imageSrc
        this.promo = promo
        this.id = id
    }
}

export default {
    state: {
        ads: [],
        myAds: []
    },
    mutations: {
        createAd (state, payload) {
            state.ads.push(payload)
        },
        loadAds (state, payload) {
            state.ads = payload
        }
    },
    actions: {
        async createAd ({commit, getters}, {title, description, imageSrc, promo}) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const newAd = new Ad(title, description, getters.user, imageSrc, promo)
                const ad = await firebase.database().ref('ads').push(newAd)

                commit('setLoading', false)
                commit('createAd', {
                    ...newAd,
                    id: ad.key
                })
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        },
        async fetchAds ({commit}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                const fbVal = await firebase.database().ref('ads').once('value')
                const ads = fbVal.val()
                const resultAds = []
                for (let key in ads) {
                    const ad = ads[key]
                    resultAds.push(
                        new Ad(ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, key)
                    )
                }

                commit('loadAds', resultAds)
                commit('setLoading', false)
            } catch (err) {
                commit('setLoading', false)
                commit('setError', err.message)
                throw err
            }
        }
    },
    getters: {
        ads (state) {
            return state.ads
        },
        promoAds (state) {
            return state.ads.filter(ad => ad.promo)
        },
        myAds (state) {
            return state.ads
        },
        adById (state) {
            return adId => {
                return state.ads.find(ad => ad.id === adId)
            }
        }
    }
}
