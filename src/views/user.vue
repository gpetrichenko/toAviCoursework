<template>
  <div class="container py-5">
    <div class="card border-white w-100">
      <div class="card-img user-bg">
        <img src="https://picsum.photos/id/177/2515/1830" class="img-fluid" alt="user-bg" />
      </div>
      <div class="card-img-overlay mt-5 textac">
        <h4 textac>Привет, {{name}} {{lastname}}</h4>
      </div>
    </div>
    <ul class="nav nav-tabs mt-2">
      <li class="nav-item">
        <router-link class="nav-link" :to="{name:'userProducts'}">Мои товары</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{name:'userEdit'}">Управление профилем</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{name:'userChangePassword'}">Изменить пароль</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{name:'userWishList'}">Избранное</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{name:'userRooms'}">Сообщения</router-link>
      </li>
    </ul>
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      id: 0,
      name: "",
      email: ""
    };
  },
  computed: {
    ...mapState(["currentUser"])
  },
  created() {
    this.setUser();
  },
  methods: {
    setUser() {
      this.id = this.currentUser.id;
      this.name = this.currentUser.name;
      this.lastname = this.currentUser.lastname;
      this.email = this.currentUser.email;
    }
  }
};
</script>
<style scoped>
.user-bg {
  height: 150px;
  overflow: hidden;
}

.user-bg img {
  margin-top: -5%;
  opacity: 0.7;
  filter: alpha(opacity=70);
}
</style>
