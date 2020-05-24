<template>
  <body>
    <section class="featured spad">
        <div class="container">
          <center>
            <div class="row">
                <div class="col-lg-12">
                      <div class="hero__search" style="margin-bottom:20px">
                          <div class="hero__search__form">
                              <form>
                                  <input v-on:keyup.enter="search" v-model="searchText" type="text" placeholder="Что вы ищете?">
                                  <button @click="search()" type="submit" class="site-btn">Найти</button>
                              </form>
                          </div>
                      </div>
                  </div>
                <div class="col-lg-12 mt-4">

                    <div class="featured__controls">
                      <ProductsNavPills :categories="categories" />

                    </div>
                </div>

            </div>
            </center>

            <div class="row featured__filter textac">
              <productCard
                v-for="product in products"
                :key="product.id"
                :initial-product="product"
                :card-height="productCardHeight"
              />
            </div>
        </div>
        <RestaurantsPagination
          v-if="totalPage > 1"
          :current-page="currentPage"
          :total-page="totalPage"
        />
    </section>
</body>
</template>

<script>
import productCard from "./../components/productCard";
import productsAPI from "./../apis/products";
import { Toast } from "./../utils/helpers";
import RestaurantsPagination from '@/components/RestaurantsPagination'
import ProductsNavPills from '@/components/ProductsNavPills'
export default {
  components: {
    productCard,
    RestaurantsPagination,
    ProductsNavPills
  },
  data() {
    return {
        categories: [],
        categoryId: '',
      products: [],
      productCardHeight: 31.5,
      currentPage: 1,
      totalPage: 0,
      searchText: ''
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  created() {
    const { page, categoryId } = this.$route.query
    this.fetchProducts({ page, categoryId });
  },
  beforeRouteUpdate(to, from, next) {
    const { page, categoryId } = to.query
    this.fetchProducts({ page, categoryId })
    next()
  },
  methods: {

    search() {
      this.searchText = this.searchText.trim()
      if (this.searchText === '') {
        Toast.fire({
          icon: 'warning',
          title: 'Please input you want to search the text！'
        })
      } else {
        this.$router.push(`/index/search?q=${this.searchText}`)
      }
    },
    async fetchProducts({ page = 1, categoryId = '' }) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await productsAPI.getProducts({
          page,
          categoryId
        });
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        let wishlist = this.$store.state.wishList;
        if (this.$store.state.isAuthenticated && wishlist.length > 0) {
          this.products = data.products.map(product => ({
            ...product,
            isFavorited: wishlist.map(d => d.id).includes(product.id)
          }));
        }
        this.products = data.products;
        this.totalPage = data.totalPage.length;
        this.categoryId = data.categoryId
        this.currentPage = data.page
        this.categories = data.categories;
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Невозможно получить информацию о продуктах, пожалуйста, попробуйте снова позже"
        });
      }
    }
  }
};
</script>
