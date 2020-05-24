<template>
  <div class="col-lg-3 col-md-4 col-sm-6 mix ">
      <div class="featured__item">
        <router-link :to="{name:'product', params:{id:product.id}}">
          <!-- <div class="featured__item__pic set-bg" data-setbg="https://i.imgur.com/F1DemUm.jpg"> -->
            <img  class="featured__item__pic" :src="cardImg"> 
          <div class="featured__item__text">
              <h6><a href="#">{{product.name}}</a></h6>
              <h5>{{product.sell_price | currency}}</h5>
          </div>
          </router-link>
      </div>
  </div>
  <!-- <div class="col-md-6 col-lg-4">
    <div class="card mb-3" id="product-card">
      <div class="row ml-1 mt-0">
        <div v-if="isAuthenticated" class="col-4 text-right position-relative">
          <div class="d-inline">
            <button
              v-if="product.isFavorited"
              type="button"
              class="btn text-danger mr-2 mt-n1"
              :disabled="isProcessing"
              @click.stop.prevent="deleteFavorite(product.id)"
            >
              <font-awesome-icon icon="heart" size="1x" />
            </button>
            <button
              v-else
              type="button"
              class="btn text-danger mr-2 mt-n1"
              :disabled="isProcessing"
              @click.stop.prevent="addFavorite(product.id)"
            >
              <font-awesome-icon :icon="['far', 'heart']" size="1x" />
            </button>
          </div>
        </div>

        <div v-else class="col-4 text-right position-relative">
          <div class="d-inline">
            <button
              type="button"
              class="btn text-danger mr-2 mt-n1"
              data-container="body"
              data-toggle="popover-hover"
              data-placement="bottom"
              :data-content="dataContent"
            >
              <font-awesome-icon class="heart-icon" :icon="['far', 'heart']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>
<script>
import { currencyFilter } from "../utils/mixins";
import $ from "jquery";
export default {
  mixins: [currencyFilter],

  props: {
    initialProduct: {
      type: Object,
      required: true
    },
    cardHeight: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      product: this.initialProduct,
      cardImg: "",
      imageFrameStyle: {
        height: this.cardHeight + "rem",
        lineHeight: this.cardHeight + "rem",
        background: "#f2f2f2"
      },
      imageStyle: {
        maxHeight: this.cardHeight + "rem"
      }
    };
  },
  created() {
    this.cardImg = this.product.image[0].url;
  },
  mounted() {
    $(function() {
      $('[data-toggle="popover-hover"]').popover({
        html: true,
        trigger: "hover",
        delay: { hide: 500 }
      });
    });
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    isProcessing() {
      return this.$store.state.isProcessing;
    },
    dataContent() {
      if (process.env.NODE_ENV == "development") {
        return "<a href='/#/signin'>Войдите/Зарегистрируйтесь</a>";
      } else {
        return "<a href='/gpo-frontend/#/signin'>Войдите/Зарегистрируйтесь</a>";
      }
    }
  },
  methods: {
    async addFavorite(productId) {
      try {
        await this.$store.dispatch("addFavorite", productId);
        this.product = {
          ...this.product,
          isFavorited: true
        };
      } catch (error) {
        return false;
      }
    },
    async deleteFavorite(productId) {
      try {
        await this.$store.dispatch("deleteFavorite", productId);
        this.product = {
          ...this.product,
          isFavorited: false
        };
      } catch (error) {
        return false;
      }
    },
    imgMouseover(imgs) {
      this.cardImg = imgs[1].url;
    },
    imgMouseleave(imgs) {
      this.cardImg = imgs[0].url;
    }
  }
};
</script>
<style lang="css" scoped>
#product-card {
  border: none;
}
.card-title {
  font-size: 1.1rem;
}
.mt-n1 {
  margin-top: -1.4rem !important;
}
.heart-icon {
  font-size: 1.2rem;
}
</style>
