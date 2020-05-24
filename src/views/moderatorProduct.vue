<template>
  <div>
    <moderator-nav></moderator-nav>
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else>
      <div class="table-responsive-md container">
        <table class="table">
          <tbody>
            <tr>
              <td>Название</td>
              <td colspan="2">{{product.name}}</td>
              <td>Категория</td>
              <td colspan="2">{{product.category}}</td>
            </tr>
            <tr>
              <td>Цена</td>
              <td>{{product.sellPrice}}</td>
              <td>Статус продукта</td>
              <td>{{product.status}}</td>
            </tr>
            <tr>
              <td>Описание</td>
              <td colspan="5">{{product.description}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="container moderatorProductImg">
        <div class="row">
          <div class="col-md-3 mb-3" v-for="image in images" :key="image.id">
            <img :src="image.url" alt />
          </div>
        </div>
      </div>
      <div class="container my-5">
        <div class="row justify-content-center">
          <button @click="goToBack" class="btn btn-outline-success mx-3">Назад</button>
          <router-link
            class="btn btn-outline-dark mx-3"
            :to="{name:'moderatorProductEdit', params:{id:product.id}}"
          >Изменить</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Spinner from "./../components/Spinner";
import moderatorNav from "./../components/moderatorNav";
import moderatorAPI from "./../apis/moderator";
import { Toast } from "./../utils/helpers";
export default {
  components: {
    moderatorNav,
    Spinner
  },
  data() {
    return {
      product: {
        id: "",
        name: "",
        category: "",
        cost: 0,
        sellPrice: 0,
        status: 0,
        description: ""
      },
      images: []
    };
  },
  created() {
    const { id } = this.$route.params;
    this.fetchModeratorProduct(id);
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchModeratorProduct(id);
    next();
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  methods: {
    async fetchModeratorProduct(id) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await moderatorAPI.products.getProductDetail({
          id
        });
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.product = {
          id: data.product.id,
          name: data.product.name,
          category: data.product.category,
          cost: data.product.cost,
          sellPrice: data.product.sell_price,
          status: data.product.status,
          description: data.product.description
        };
        this.images = data.product.images;
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Невозможно получить детали продукта, попробуйте немного позже"
        });
      }
    },
    goToBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.moderatorProductImg img {
  width: 100%;
  height: auto;
}
</style>
