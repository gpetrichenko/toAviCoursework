<template>
  <div>
  <div class="container py-5">
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else class="row">
      <div class="col-md-12">
        <productBreadcrumb :path="path" />
      </div>
      <section class="product-details spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-6">
                  <productCarousel :product-images="productImgs" />
                </div>
                <productDetail :initial-product="product" />

            </div>
        </div>
    </section>


    </div>
  </div>
</div>
</template>
<script>
import productBreadcrumb from "./../components/productBreadcrumb";
import productCarousel from "./../components/productCarousel";
import productDetail from "./../components/productDetail";
import Spinner from "./../components/Spinner";
import productsAPI from "./../apis/products";
import { Toast } from "./../utils/helpers";

export default {
  components: {
    productBreadcrumb,
    productCarousel,
    productDetail,
    Spinner
  },
  data() {
    return {
      path: {
        categoryId: -1,
        categoryName: "",
        namd: ""
      },
      product: {
        id: 0,
        name: "",
        sellPrice: "",
        originPricd: "",
        description: "",
        isFavorited: false,
        CreatedRoom: 0,
        authorName: "",
        authorLastname: "",
      },
      productImgs: []
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  created() {
    const { id: productId } = this.$route.params;
    this.fetchProduct(productId);
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchProduct(id);
    next();
  },
  methods: {
    async fetchProduct(productId) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await productsAPI.getProduct({
          productId
        });
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        let wishlist = this.$store.state.wishList;
        this.path = {
          categoryId: data.product.CategoryId,
          categoryName: data.product.category,
          name: data.product.name
        };
        if (this.$store.state.isAuthenticated && wishlist.length > 0) {
          this.product = {
            id: data.product.id,
            name: data.product.name,
            sellPrice: data.product.sell_price,
            authorName: data.product.authorName,
            authorLastname:  data.product.authorLastname,
            description: data.product.description,
            isFavorited: wishlist.map(d => d.id).includes(data.product.id),
            CreatedRoom: data.product.CreatedRoom
          };
        }
        else if (this.$store.state.isAuthenticated) {
          this.product = {
            id: data.product.id,
            name: data.product.name,
            sellPrice: data.product.sell_price,
            authorName: data.product.authorName,
            authorLastname:  data.product.authorLastname,
            description: data.product.description,
            CreatedRoom: data.product.CreatedRoom
          };
        }
        else {
          this.product = {
            id: data.product.id,
            name: data.product.name,
            sellPrice: data.product.sell_price,
            originPricd: data.product.origin_price,
            description: data.product.description
          };
        }
        this.productImgs = data.product.images;
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Не получается получить информацию о продукте, пожалуйста, попробуйте снова позже"
        });
      }
    }
  }
};
</script>
