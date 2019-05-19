import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  isDarkMode: window.localStorage.getItem("isDarkMode") === "true"
};

const getters = {
  isDarkMode(state) {
    return state.isDarkMode;
  }
};

const mutations = {
  toggleDarkMode(state) {
    state.isDarkMode = !state.isDarkMode;
    window.localStorage.setItem("isDarkMode", state.isDarkMode);
  }
};

const actions = {
  triggerDarkMode(context) {
    context.commit("toggleDarkMode");
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
