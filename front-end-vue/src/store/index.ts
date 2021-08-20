import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    is_auth: false
  },
  mutations: {
    authenticate(state) {
      state.is_auth = true;
    },
    unauthenticate(state) {
      state.is_auth = false;
    }
  },
  actions: {
    authenticate({ commit }) {
      commit('authenticate')
    },
    unauthenticate({ commit }) {
      commit('unauthenticate')
    }
  },
  modules: {
  }
})
