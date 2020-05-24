<template>
  <div>
    <vs-navbar v-model="activeItem" class="nabarx">
      <div slot="title">
        <vs-navbar-title>
          <router-link class="navbar-brand col-2" :to="{name:'index'}">
            <img src="./../static/toAvi1.png" alt="logo" style="max-width:100px" />
          </router-link>
        </vs-navbar-title>
      </div>

      <vs-navbar-item index="0">
        <a><template v-if="!isAuthenticated || !currentUser.role === 'admin'">
          <a>
            <router-link class="nav-link" :to="{name:'signIn'}">Вход / Регистрация</router-link>
          </a>
        </template></a>
      </vs-navbar-item>
      <template v-if="isAuthenticated || currentUser.role === 'admin'">

        <vs-navbar-item index="1">
          <router-link
          :to="{name: 'userProducts', params:{id: currentUser.id}}"
          >
          Профиль
        </router-link>
      </vs-navbar-item>
      <vs-navbar-item index="2">
        <router-link
        :to="{name: 'userWishList', params:{id: currentUser.id}}"
        >
        Избранное
      </router-link>
    </vs-navbar-item>

  </template>
  <template v-if="currentUser.role === 'moderator' || currentUser.role === 'admin'">
    <vs-navbar-item>
      <router-link class="nav-link" style="color:#147887" :to="{name: 'moderatorProducts'}">
        Модератор
      </router-link>
    </vs-navbar-item>
  </template>
  <template v-if="currentUser.role === 'admin'">
    <vs-navbar-item>
      <router-link class="nav-link" style="color:#0daa3d" :to="{name: 'adminProducts'}">
        Администратор
      </router-link>
    </vs-navbar-item>
  </template>
  <template v-if="isAuthenticated">
    <vs-navbar-item>
      <a @click="logout">Выход</a>
    </vs-navbar-item>
  </template>
</vs-navbar>
</div>
</template>
<script>
import { mapState } from "vuex";
import categoriesAPI from "./../apis/categories";
import { Toast } from "./../utils/helpers";
export default {
  data() {
    return {
      categories: []
    };
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
    inAboutPage() {
      if (this.$route.name == "about") {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.fetchCategories();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchCategories();
    next();
  },
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/index");
    },
    async fetchCategories() {
      try {
        this.$store.dispatch("updateProcessing", false);
        const { data, statusText } = await categoriesAPI.getCategories();
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.categories = data.categories;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Получить информацию о категории не удалось, попробуйте немного позже"
        });
      }
    },
    gotoContact(el) {
      this.$router.push({ name: "about", query: { el } });
    }
  }
};
</script>
