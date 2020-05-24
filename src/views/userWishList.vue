<template>
  <div class="container py-5">
    <div v-if="products.length == 0">
      <h3 class="mt-4">Вы еще не добавили ни один товар в список желаний</h3>
    </div>
    <div v-else class="row">
      <productCard v-for="product in products" :key="product.id" :initial-product="product" :card-height="productCardHeight"/>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import productCard from "./../components/productCard";
export default {
  components: {
    productCard
  },
  data() {
    return {
      isLoading: false,
      productCardHeight: 31.5
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    products() {
      return this.$store.state.wishList;
    }
  },
  created() {
    this.fetchUserFavorite();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchUserFavorite();
    next();
  },
  methods: {
    fetchUserFavorite() {
      this.$store.dispatch("fetchUserFavorite");
    }
  }
};
</script>
