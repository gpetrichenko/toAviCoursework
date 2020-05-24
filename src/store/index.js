import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import usersAPI from './../apis/users'
import chatsAPI from './../apis/chat'
import productsAPI from './../apis/products'
import { Toast } from "./../utils/helpers";


Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'my-app',
  storage: window.localStorage
})

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    currentUser: {
      id: -1,
      name: '',
      email: '',
      role: false
    },
    wishList: {},
    cart: {},
    isAuthenticated: false,
    isProcessing: false,
    isLoading: true,
    token: ''
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser
      }
      state.token = localStorage.getItem('token')
      state.isAuthenticated = true
    },
    updateCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser
      }
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
    },
    WISHLIST(state, payload) {
      state.wishList = payload
    },
    CART(state, payload) {
      state.cart = payload
    },
    PROCESSING(state, status) {
      state.isProcessing = status
    },
    LOADING(state, status) {
      state.isLoading = status
    }
  },
  actions: {
    updateProcessing(context, status) {
      context.commit('PROCESSING', status)
    },
    updateLoading(context, status) {
      context.commit("LOADING", status)
    },
    updateCurrentUser(context, currentUser) {
      context.commit("updateCurrentUser", currentUser)
    },
    async fetchCurrentUser({ commit }) {
      try {
        const { data, statusText } = await usersAPI.getCurrentUser()
        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        commit('setCurrentUser', {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        })
        return true
      } catch (error) {
        commit('revokeAuthentication')
        return false
      }
    },
    async fetchUserFavorite(context) {
      try {
        const { data, statusText } = await usersAPI.getUserFavorite()
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        context.commit('WISHLIST', data.products);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Не получается получить информацию о продукте, пожалуйста, попробуйте снова позже"
        });
      }
    },
    async addFavorite(context, productId) {
      try {
        context.dispatch("updateProcessing", true);
        const { data, statusText } = await productsAPI.addFavorite({
          productId
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        await context.dispatch('fetchUserFavorite')
        Toast.fire({
          icon: "success",
          title: "Товар добавлен в избранное"
        });
        context.dispatch("updateProcessing", false);
      } catch (error) {
        context.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Товар не добавлен в избранное, попробуйте немного позже"
        });
      }
    },
    async addRoom(context, productId) {
      try {
        context.dispatch("updateProcessing", true);
        const { data, statusText } = await chatsAPI.addRoom({
           productId
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        Toast.fire({
          icon: "success",
          title: "Получилось"
        });
        context.dispatch("updateProcessing", false);
      } catch (error) {
        context.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Не получилось"
        });
      }
    },
    async deleteFavorite(context, productId) {
      try {
        context.dispatch("updateProcessing", true);
        const { data, statusText } = await productsAPI.deleteFavorite({
          productId
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        await context.dispatch('fetchUserFavorite')
        Toast.fire({
          icon: "success",
          title: "Больше не в избранных товарах"
        });
        context.dispatch("updateProcessing", false);
      } catch (error) {
        context.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Не удалось убрать из избранного, пожалуйста, попробуйте снова позже"
        });
      }
    }
  },
  getters: {
    wishList: state => state.wishList,
  },
  modules: {
  }
})
