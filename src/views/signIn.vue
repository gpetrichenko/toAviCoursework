<template>
  <div>

  <div class="container py-5">
    <div class="breadcrumb-area">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumb-wrap">
                        <nav aria-label="breadcrumb">
                            <div class="breadcrumb-title">Вход / Регистрация</div>
                            <ul class="breadcrumb">
                                <li class="breadcrumb-item"><router-link :to="{name:'index'}">Главная</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">Вход - Регистрация</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="login-register-wrapper pt-68 pb-6 pt-sm-50 " style="margin-top:30px;">
        <div class="container">
            <div class="member-area-from-wrap">
                <div class="row">
                    <div class="col-lg-6">
                        <form class="login-reg-form-wrap  pr-lg-50" @submit.prevent.stop="handleSubmitSignIn">
                            <h2 class="textac">Вход</h2>
                              <ValidationProvider rules="required|email" v-slot="{ errors }">
                                <div class="single-input-item">
                                  <input
                                    id="email"
                                    v-model="email"
                                    name="email"
                                    placeholder="Введите email"
                                    required
                                  />
                                  <span class="d-flex">
                                    <small class="text-danger">{{ errors[0] }}</small>
                                  </span>
                                </div>
                              </ValidationProvider>

                              <ValidationProvider rules="required|password" v-slot="{ errors }">
                                <div class="single-input-item">
                                  <input
                                    id="password"
                                    v-model="password"
                                    name="password"
                                    type="password"
                                    placeholder="Введите пароль"
                                    required
                                  />
                                  <span class="d-flex">
                                    <small class="text-danger">{{ errors[0] }}</small>
                                  </span>
                                </div>
                              </ValidationProvider>


                              <div class="w-100" >
                                <button
                                  class="single-input-item btn btn-lg btn-outline-secondary btn-block btn-sm mb-3"
                                  type="submit"
                                  :disabled="isProcessing"
                                >Вход</button>
                              </div>
                        </form>
                    </div>
                    <div class="col-lg-6">
                        <div class="login-reg-form-wrap signup-form">
                            <h2 class="textac">Регистрация</h2>
                            <form @submit.prevent.stop="handleSubmitSignUp">
                              <ValidationProvider rules="required" v-slot="{ errors }">
                                <div class="single-input-item">
                                  <input
                                    id="name"
                                    name="name"
                                    v-model="registerName"
                                    type="text"
                                    placeholder="Введите имя"
                                    required
                                  />
                                  <span class="d-flex">
                                    <small class="text-danger">{{ errors[0] }}</small>
                                  </span>
                                </div>
                              </ValidationProvider>
                              <ValidationProvider rules="required" v-slot="{ errors }">
                                <div class="single-input-item">
                                  <input
                                    id="lastname"
                                    name="lastname"
                                    v-model="registerLastname"
                                    type="text"
                                    placeholder="Введите фамилию"
                                    required
                                  />
                                  <span class="d-flex">
                                    <small class="text-danger">{{ errors[0] }}</small>
                                  </span>
                                </div>
                              </ValidationProvider>
                                <ValidationProvider rules="required|email" v-slot="{ errors }">
                                  <div class="single-input-item">
                                    <input
                                      name="email"
                                      v-model="registerEmail"
                                      type="email"
                                      placeholder="Введите email"
                                      required
                                    />
                                    <span class="d-flex">
                                      <small class="text-danger">{{ errors[0] }}</small>
                                    </span>
                                  </div>
                                </ValidationProvider>
                                <ValidationProvider
                                  rules="required|password"
                                  v-slot="{ errors }"
                                  vid="registerPassword"
                                >
                                  <div class="single-input-item">
                                    <input
                                      id="register-password"
                                      name="register-password"
                                      v-model="registerPassword"
                                      type="password"
                                      placeholder="Введите пароль"
                                      required
                                    />
                                    <span class="d-flex">
                                      <small class="text-danger">{{ errors[0] }}</small>
                                    </span>
                                  </div>
                                </ValidationProvider>
                                <ValidationProvider rules="required|confirmed:registerPassword" v-slot="{ errors }">
                                  <div class="single-input-item">
                                    <input
                                      id="register-password-check"
                                      name="register-password-check"
                                      v-model="registerPasswordCheck"
                                      type="password"
                                      placeholder="Подтвердите пароль"
                                      required
                                    />
                                    <span class="d-flex">
                                      <small class="text-danger">{{ errors[0] }}</small>
                                    </span>
                                  </div>
                                </ValidationProvider>
                                <button
                                  class="single-input-item btn btn-lg btn-outline-secondary btn-block btn-sm mb-3"
                                  type="submit"
                                  :disabled="isProcessing"
                                >Зарегистрироваться</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { ValidationProvider } from "vee-validate";
import authorizationAPI from "./../apis/authorization";
import { Toast } from "./../utils/helpers";
export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      email: "",
      password: "",
      registerEmail: "",
      registerName: "",
      registerLastname: "",
      registerPassword: "",
      registerPasswordCheck: ""
    };
  },
  computed: {
    isProcessing() {
      return this.$store.state.isProcessing;
    }
  },
  methods: {
    async handleSubmitSignIn() {
      try {
        if (!this.email || !this.password) {
          Toast.fire({
            icon: "warning",
            title: "Заполните все поля"
          });
          return;
        }
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await authorizationAPI.signIn({
          email: this.email,
          password: this.password
        });

        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        localStorage.setItem("token", data.token);
        await this.$store.commit("setCurrentUser", data.user);
        await this.$store.dispatch("fetchUserFavorite", data.user.id);
        Toast.fire({
          icon: "success",
          title: "Вход осуществлен успешно"
        });
        // Возвращение на предыдущую страницу
        this.$router.go(-1);
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.password = "";
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "warning",
          title: "Пожалуйста проверьте правильностьв введеных данных"
        });
      }
    },
    async handleSubmitSignUp() {
      try {
        if (
          !this.registerEmail ||
          !this.registerName ||
          !this.registerLastname ||
          !this.registerPassword ||
          !this.registerPasswordCheck
        ) {
          Toast.fire({
            icon: "warning",
            title: "Все поля являются обязательными к заполнению"
          });
          return;
        }
        if (this.registerPassword !== this.registerPasswordCheck) {
          Toast.fire({
            icon: "warning",
            title: "Пароли разные"
          });
          return;
        }
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await authorizationAPI.signUp({
          email: this.registerEmail,
          name: this.registerName,
          lastname: this.registerLastname,
          password: this.registerPassword,
          passwordCheck: this.registerPasswordCheck
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(data.message);
        }
        localStorage.setItem("token", data.token);
        this.$store.commit("setCurrentUser", data.user);
        Toast.fire({
          icon: "success",
          title: "Регистрация осуществлена успешно"
        });
        // Возврат на предыдушую страницу
        this.$router.go(-1);
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        this.registerPassword = "";
        this.registerPasswordCheck = "";
        Toast.fire({
          icon: "warning",
          title: "Не удалось зарегистрироваться, проверьте правильность введенных данных"
        });
      }
    }
  }
};
</script>
<style scoped>
.signin-img {
  height: 200px;
  overflow: hidden;
}

.signin-img img {
  margin-top: -5%;
  opacity: 0.5;
  filter: alpha(opacity=50);
}
</style>
