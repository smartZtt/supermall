import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

//1.创建Store对象
Vue.use(Vuex)

const state = {
  cartList: [],
  isLoading: true
}

//2.创建Store对象
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

//3.挂载Vue实例上
export default store
