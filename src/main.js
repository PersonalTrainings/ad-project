import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyModalComponent from '@/components/Shared/BuyModal'
import * as firebase from 'firebase'
import FirebaseConfig from '../config/config.json'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
    theme: {
        error: '#DD2C00'
    }
})
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
    firebase.initializeApp(FirebaseConfig)
    // get user from local storage

    // firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //         this.$store.dispatch('authCheckState', user)
    //     }
    // })

    this.$store.dispatch('fetchAds')
  }
})
