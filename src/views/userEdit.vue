<template>
  <div class="container">
    <div class="d-flex justify-content-center">
      <form class="w-75 mt-4" @submit.stop.prevent="handleSubmit">
        <div class="form-label-group mb-2">
          <label for="name" class="d-flex">Имя пользователя:</label>
          <input
            id="name"
            name="name"
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Enter name"
          />
        </div>
        <div class="form-label-group mb-2">
          <label for="email" class="d-flex">Email:</label>
          <ValidationProvider rules="required|email" v-slot="{ errors }">
            <input
              id="email"
              name="email"
              v-model="email"
              type="email"
              class="form-control"
              placeholder="email"
            />
            <span class="d-flex">
              <small class="text-danger">{{ errors[0] }}</small>
            </span>
          </ValidationProvider>
          <small class="text-muted">＊ Напоминание: электронная почта - это учетная запись пользователя и контактный почтовый ящик.</small>
        </div>
        <button
          class="btn btn-lg btn-outline-secondary btn-block btn-sm mb-3"
          type="submit"
          :disabled="isProcessing"
        >{{isProcessing ? "Изменение..." : "Обновить информацию о пользователе"}}</button>
      </form>
    </div>
  </div>
</template>
<script>
import usersAPI from "./../apis/users";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";
export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      id: 0,
      name: "",
      email: "",
    };
  },
  computed: {
    ...mapState(["currentUser", "isProcessing"]),
    formData() {
      let { id, name, email} = this;
      return { id, name, email };
    }
  },
  watch: {
    currentUser() {
      this.setUser();
    }
  },
  created() {
    this.setUser();
  },
  methods: {
    setUser() {
      this.id = this.currentUser.id;
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
    },
    async handleSubmit() {
      if (this.email !== this.currentUser.email.toString()) {
        Toast.fire({
          icon: "warning",
          title: "Ошибка"
        });
        return;
      }
      const formData = this.formData;
      try {
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await usersAPI.putUser({ formData });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        Toast.fire({
          icon: "success",
          title: "Данные пользователя успешно обновлены"
        });
        await this.$store.dispatch("updateCurrentUser", formData);
        this.$router.push({ name: "userEdit" });
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Невозможно обновить информацию о пользователе, повторите попытку позже."
        });
      }
    }
  }
};
</script>
