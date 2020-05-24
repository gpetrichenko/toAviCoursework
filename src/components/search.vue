<template>
  <div>
    <input type="text" id="search" placeholder="Поиск по объявлениям" autocomplete="off" spellcheck="false" maxlength="100" data-marker="search-form/suggest" class="suggest-root-1v2AH js-suggest suggest_search" value="">
    <button data-marker="search-form/submit-button" class="index-buttonElement-3wfmP button-button-2Fo5k button-size-s-3-rn6 button-default-mSfac" aria-busy="false"><span class="button-textBox-Row9K">Найти</span></button>
    <b-navbar
      toggleable="lg"
      type="dark"
      class="blue-grey lighten-1"
      fixed
      sticky
    >


      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-nav class="ml-auto">

          <b-nav-form
            class="Navbar-search"
            @submit.stop.prevent="submitSearch"
          >
            <b-form-input
              v-model="searchItem"
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
            >Search</b-button>
          </b-nav-form>
      
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { Toast } from '../utils/helpers'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      userId: '',
      searchItem: ''
    }
  },
  computed: {
    ...mapState(['currentUser', 'isAuthenticated'])
  },
  methods: {
    submitSearch() {
      if (this.searchItem.length <= 0) {
        return Toast.fire({
          icon: 'warning',
          title: "Required Field didn't exist"
        })
      }
      if (
        this.searchItem !== decodeURI(document.location.search).split('=')[1]
      ) {
        this.$router
          .push({
            path: '/furnitures/search',
            query: { items: this.searchItem }
          })
          .catch(err => {
            return Toast.fire({ icon: 'error', title: err })
          })
      }
    },
    logout() {
      this.$store.commit('revokeAuthentication')
      this.$router.go({ name: 'SignIn' })
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 992px) {
  .Navbar-search {
    align-self: center;
  }
  .form-inline {
    flex-flow: row nowrap;
  }
  .bg-white {
    background: white;
  }
}
</style>
