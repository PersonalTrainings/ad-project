export default {
    state: {
        ads: [
            {
                title: 'First Ad',
                description: 'This desctiption for ad',
                promo: false,
                imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                id: '1'
            },
            {
                title: 'Second Ad',
                description: 'This desctiption for ad',
                promo: true,
                imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                id: '2'
            },
            {
                title: 'Third Ad',
                description: 'This desctiption for ad',
                promo: true,
                imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
                id: '3'
            }
        ],
        myAds: []
    },
    mutations: {
        createAd (state, payload) {
            state.ads.push(payload)
        }
    },
    actions: {
        createAd ({commit}, payload) {
            payload.id = '' + Math.floor(Math.random() * 6) + 1
            commit('createAd', payload)
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
