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
        },
        updateAd (state, {title, description, id}) {
            const ad = state.ads.find(a => a.id === id)

            ad.title = title
            ad.description = description
        }
    },
    actions: {
        async createAd ({commit, getters}, {title, description, image, promo}) {
            commit('clearError')
            commit('setLoading', true)
            try {
                const newAd = new Ad(title, description, getters.user.id, '', promo)
                const ad = await firebase.database().ref('ads').push(newAd)
                const imageExt = image.name.slice(image.name.lastIndexOf('.'))

                const metadata = { contentType: image.type }

                const fileData = await firebase.storage().ref(`ad/${ad.key}${imageExt}`).put(image, metadata)
                const imageSrc = await fileData.ref.getDownloadURL()
                await firebase.database().ref('ads').child(ad.key).update({imageSrc})
                commit('setLoading', false)
                commit('createAd', {
                    ...newAd,
                    id: ad.key,
                    imageSrc
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
        },
        async updateAd ({commit}, {title, description, id}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                await firebase.database().ref('ads').child(id).update({
                    title,
                    description
                })
                commit('updateAd', {
                    title, description, id
                })
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
        myAds (state, getters) {
            return state.ads.filter(ad => ad.ownerId === getters.user.id)
        },
        adById (state) {
            return adId => {
                return state.ads.find(ad => ad.id === adId)
            }
        }
    }
}
