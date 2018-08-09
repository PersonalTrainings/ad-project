import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyModalComponent from '@/components/Shared/BuyModal'
import * as firebase from 'firebase'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.component('app-buy-modal', BuyModalComponent)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
        apiKey: 'AIzaSyByuH0X8m5j6LxvDzsVaUZcaI4DFW6iTlk',
        authDomain: 'itc-ads-59d3a.firebaseapp.com',
        databaseURL: 'https://itc-ads-59d3a.firebaseio.com',
        projectId: 'itc-ads-59d3a',
        storageBucket: 'itc-ads-59d3a.appspot.com',
        messagingSenderId: '160935180786'
    })
    // get user from local storage

    // firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //         this.$store.dispatch('authCheckState', user)
    //     }
    // })

    this.$store.dispatch('fetchAds')
  }
})
