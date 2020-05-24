<template>
  <div>
    <div>
      <nav class="navbar navbar-default">
        <div class="container">
          <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav navbar-block navbar-left">
              <li><a>Dashboard</a></li>
              <li><a>Pages</a></li>
              <li><a>Posts</a></li>
              <li><a>Users</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-block navbar-right">
              <li><a>Welcome, User</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <header id="header">
        <div class="container">
          <div class="row">
            <adminNav />
          </div>
        </div>
      </header>
      <section id="main">
        <div class="container">
          <div class="row">
            <div class="col-md-3">
              <adminNavigation/>
              <a class="nav-main-color list-group-item mb-1 textac" style="color:white">
                Функции
              </a>
              <router-link class="btn btn-outline-primary btn-block" :to="{name:'adminProductCreate'}">Добавить продукт</router-link>
              <p></p>
            </div>
            <div class="col-md-9">
              <div class="panel panel-default ">
                <div class="panel-heading main-color-bg">
                </div>
                <div class="panel-body">
                  <div class="table-responsive-md">
                    <table class="table table-striped">
                      <thead class="thead-dark">
                        <tr>
                          <th scope="col" class="textac">Название</th>
                          <th scope="col" class="textac">Категория</th>
                          <th scope="col" class="textac">Цена</th>
                          <th scope="col" class="textac">Статус</th>
                          <th scope="col" class="textac">Редактировать</th>
                          <th scope="col" class="textac">Удалить</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="product in products" :key="product.id">
                          <td scope="col" class="textac">
                            <router-link :to="{name:'adminProduct',params:{id:product.id}}">{{product.name}}</router-link>
                          </td>
                          <td scope="col" class="textac">{{product.category}}</td>
                          <td scope="col" class="textac">{{product.sell_price}}</td>
                          <td scope="col" class="textac">{{product.status}}</td>
                          <td scope="col" class="textac">
                            <router-link
                            :to="{name:'adminProductEdit', params:{id:product.id}}"
                            class="btn btn-outline-dark"
                            >Изменить</router-link>
                          </td>
                          <td scope="col" class="textac">
                            <button
                            type="button"
                            class="btn btn-outline-danger"
                            @click.stop.prevent="deleteProduct(product.id)"
                            >Удалить</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <nav v-if="totalPage > 1" aria-label="Page navigation">
                      <ul class="pagination">
                        <li v-show="previousPage" class="page-item">
                          <router-link
                          class="page-link"
                          aria-label="Previous"
                          :to="{name: 'adminProducts', query: { page: previousPage }}"
                          >
                          <span aria-hidden="true">&laquo;</span>
                        </router-link>
                      </li>
                      <li
                      v-for="page in totalPage"
                      :key="page"
                      :class="['page-item', { active: currentPage === page }]"
                      >
                      <router-link class="page-link" :to="{name: 'adminProducts', query: { page }}">{{ page }}</router-link>
                    </li>
                    <li v-show="nextPage" class="page-item">
                      <router-link
                      class="page-link"
                      :to="{name: 'adminProducts', query: { page: nextPage }}"
                      aria-label="Next"
                      >
                      <span aria-hidden="true">&raquo;</span>
                    </router-link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</div>
</div>
</template>
<script>
import adminNav from "./../components/adminNav";
import moderatorAPI from "./../apis/moderator";
import adminNavigation from "./../components/AdminNavigation";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
export default {
  components: {
    adminNav,
    adminNavigation
  },
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
    this.fetchAdminProducts({ page });
  },
  beforeRouteUpdate(to, from, next) {
    const { page } = to.query;
    this.fetchAdminProducts({ page });
    next();
  },
  methods: {
    async deleteProduct(productId) {
      try {
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await moderatorAPI.products.delete({
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
    async fetchAdminProducts({ page = 1 }) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await moderatorAPI.products.get({
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
          title: "Невозможно получить информацию о продуктах"
        });
      }
    }
  }
};
</script>
