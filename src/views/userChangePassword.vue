<template>
  <div class="container">
    <div class="d-flex justify-content-center">
      <form class="w-75 mt-4" @submit.stop.prevent="handleSubmit">
        <div class="form-label-group mb-2">
          <label for="name" class="d-flex">Старый пароль:</label>
          <ValidationProvider rules="required|password" v-slot="{ errors }">
            <input
              id="used-password"
              name="usedPassword"
              v-model="usedPassword"
              type="password"
              class="form-control"
              placeholder="Пожалуйста, введите текущий старый пароль"
              required
            />
            <span class="d-flex">
              <small class="text-danger">{{ errors[0] }}</small>
            </span>
          </ValidationProvider>
        </div>
        <div class="form-label-group mb-2">
          <label for="name" class="d-flex">Новый пароль:</label>
          <ValidationProvider rules="required|password" v-slot="{ errors }" vid="newPassword">
            <input
              id="new-password"
              name="newPassword"
              v-model="newPassword"
              type="password"
              class="form-control"
              placeholder="Пожалуйста, установите новый пароль"
              required
            />
            <span class="d-flex">
              <small class="text-danger">{{ errors[0] }}</small>
            </span>
          </ValidationProvider>
        </div>
        <div class="form-label-group mb-2">
          <label for="name" class="d-flex">Подтверждение нового пароля:</label>
          <ValidationProvider rules="required|confirmed:newPassword" v-slot="{ errors }">
            <input
              id="password-check"
              name="passwordCheck"
              v-model="passwordCheck"
              type="password"
              class="form-control"
              placeholder="Подтвердите новый пароль"
              required
            />
            <span class="d-flex">
              <small class="text-danger">{{ errors[0] }}</small>
            </span>
          </ValidationProvider>
        </div>

        <button
          class="btn btn-lg btn-outline-secondary btn-block btn-sm mb-3"
          type="submit"
        >{{isProcessing ? "Изменение..." : "Изменить пароль"}}</button>
      </form>
    </div>
  </div>
</template>
<script>
import { ValidationProvider } from "vee-validate";
import usersAPI from "./../apis/users";
import { Toast } from "./../utils/helpers";
export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      usedPassword: "",
      newPassword: "",
      passwordCheck: ""
    };
  },
  computed: {
    isProcessing() {
      return this.$store.state.isProcessing;
    },
    formData() {
      const { usedPassword, newPassword, passwordCheck } = this;
      return {
        usedPassword,
        newPassword,
        passwordCheck
      };
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.usedPassword || !this.newPassword || !this.passwordCheck) {
        Toast.fire({
          icon: "warning",
          title: "Все поля обязательны к наполнению"
        });
        return;
      }
      if (this.usedPassword == this.newPassword) {
        Toast.fire({
          icon: "warning",
          title: "Новый пароль не может совпадать со старым паролем"
        });
        return;
      }
      if (this.newPassword !== this.passwordCheck) {
        Toast.fire({
          icon: "warning",
          title: "Новые пароли не совпадают"
        });
        return;
      }
      const formData = this.formData;
      try {
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await usersAPI.postPasswordChange({
          formData
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        Toast.fire({
          icon: "success",
          title: "Пароль успешно обновлен, пожалуйста, войдите с новым паролем"
        });
        this.$router.push({ name: "signIn" });
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Не удалось обновить пароль, пожалуйста, подтвердите, что пароль введен правильно"
        });
      }
    }
  }
};
</script>
