import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    is_auth: false,
    user: {},
    isChatActive: false as boolean,
  },
  mutations: {
    authenticate(state) {
      state.is_auth = true;
    },
    unauthenticate(state) {
      state.is_auth = false;
    },
    activateChat(state) {
      state.isChatActive = true;
    },
    desactivateChat(state) {
      state.isChatActive = false;
    },
  },
  actions: {
    authenticate({ commit }) {
      commit('authenticate')
    },
    unauthenticate({ commit }) {
      commit('unauthenticate')
    },
    activateChat({ commit }) {
      commit('activateChat');
    },
    desactivateChat({ commit }) {
      commit('desactivateChat');
    },
  },
  modules: {
  }
})
