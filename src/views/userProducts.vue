<template>
  <div>
    <div class="container mb-5">
      <div class="text-left">
        <h1>
          <router-link class="btn btn-outline-primary" :to="{name:'adminProductCreate'}">Новый товар</router-link>
        </h1>
      </div>
      <div class="table-responsive-md">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <!-- <th scope="col">id</th> -->
              <th scope="col textac" style="text-align: center;">Название</th>
              <th scope="col textac" style="text-align: center;">Категория</th>
              <th scope="col textac" style="text-align: center;">Цена</th>
              <th scope="col textac" style="text-align: center;">Статус</th>
              <th scope="col textac" style="text-align: center;">Редактировать</th>
              <th scope="col textac" style="text-align: center;">Удалить</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <!-- <td scope="col">{{product.id}}</td> -->
              <td scope="col" style="text-align: center;">
                <router-link :to="{name:'userProduct',params:{id:product.id}}">{{product.name}}</router-link>
              </td>
              <td scope="col textac" style="text-align: center;">{{product.category}}</td>
              <td scope="col textac" style="text-align: center;">{{product.sell_price}}</td>
              <td scope="col textac" style="text-align: center;">{{product.status}}</td>
              <td scope="col textac" style="text-align: center;">
                <router-link
                  :to="{name:'userProductEdit', params:{id:product.id}}"
                  class="btn btn-outline-dark"
                >Изменить</router-link>
              </td>
              <td scope="col textac" class="textac" style="text-align: center;">
                <button
                type="button"
                class="btn btn-outline-danger"
                @click.stop.prevent="deleteProduct(product.id)"
                >Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav v-if="totalPage > 1" aria-label="Page navigation">
        <ul class="pagination">
          <li v-show="previousPage" class="page-item">
            <router-link
              class="page-link"
              aria-label="Previous"
              :to="{name: 'userProducts', query: { page: previousPage }}"
            >
              <span aria-hidden="true">&laquo;</span>
            </router-link>
          </li>
          <li
            v-for="page in totalPage"
            :key="page"
            :class="['page-item', { active: currentPage === page }]"
          >
            <router-link class="page-link" :to="{name: 'userProducts', query: { page }}">{{ page }}</router-link>
          </li>
          <li v-show="nextPage" class="page-item">
            <router-link
              class="page-link"
              :to="{name: 'adminProductCreate', query: { page: nextPage }}"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
import userAPI from "./../apis/users";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";

export default {
  data() {
    return {
      products: [],
      currentPage: 0,
      totalPage: 0
    };
  },
  computed: {
    ...mapState(["currentUser"]),

    previousPage() {
      return this.currentPage === 1 ? null : this.currentPage - 1;
    },
    nextPage() {
      return this.currentPage + 1 > this.totalPage
        ? null
        : this.currentPage + 1;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  created() {
    const { page } = this.$route.query;
    this.fetchUserProducts({ page });
  },
  beforeRouteUpdate(to, from, next) {
    const { page } = to.query;
    this.fetchUserProducts({ page });
    next();
  },
  methods: {
    async deleteProduct(productId) {
      try {
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await userAPI.products.delete({
          productId
        });

        if (statusText !== "OK" && data.status !== "success") {
          throw new Error(statusText);
        }
        this.products = this.products.filter(
          product => product.id !== productId
        );
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Продукт не может быть удалена"
        });
      }
    },
    async fetchUserProducts({ page = 1 }) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await userAPI.getUserProducts({
          page
        });
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.products = data.products;
        this.currentPage = data.page;
        this.totalPage = data.totalPage.length;
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Невозможно получить информацию о продукте"
        });
      }
    }
  }
};
</script>
