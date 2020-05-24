<template>
    <div class="col-lg-6 col-md-6">
        <div class="product__details__text">
            <h3>{{product.name}}</h3>
            <div class="product__details__rating">
                <!-- <span>(18 reviews)</span> -->
            </div>
            <div class="product__details__price">{{product.sellPrice | currency}}</div>
            <p>{{product.description}}</p>
            <div class="product__details__quantity">
              <div class="mt-1" v-if="isAuthenticated">
                <button
                  v-if="product.isFavorited"
                  type="button"
                  class="btn btn-outline-danger product-detail-btn textal"
                  :disabled="isProcessing"
                  @click.stop.prevent="deleteFavorite(product.id)"
                >
                  <font-awesome-icon class="mr-1" icon="heart" size="1x" />Убрать из избранного
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-outline-danger product-detail-btn textal"
                  :disabled="isProcessing"
                  @click.stop.prevent="addFavorite(product.id)"
                >
                  <font-awesome-icon class="mr-1" :icon="['far', 'heart']" size="1x" />Добавить в избранное
                </button>
              </div>
              <div class="mt-1" v-if="isAuthenticated">
                <template v-if="product.CreatedRoom == 0">
                <button
                  type="button"
                  class="btn btn-outline-secondary product-detail-btn textal"
                  :disabled="isProcessing"
                  @click.stop.prevent="addRoom(product.id)"
                >
                  <font-awesome-icon class="mr-1" :icon="['far', 'message']" size="1x" />Написать сообщение

                </button>
              </template>
              <template v-else-if="product.CreatedRoom !== 0">
                <router-link
                  :to="{ name: 'room', params: { id: product.CreatedRoom }}"
                ><div
                class="btn btn-outline-secondary product-detail-btn textal ">Написать сообщение</div></router-link> </template>

              </div>
              <div v-else class="mt-1">
                <button
                  type="button"
                  class="btn btn-sm text-danger btn-block mr-2"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="bottom"
                  data-content="Войдите/Зарегистрируйтесь"
                  @mouseover="heartToggle"
                >
                  <font-awesome-icon class="mr-1" :icon="['far', 'heart']" size="1x" />Избранное
                </button>
              </div>
            </div>
            <ul>
                <li><b>Автор</b> <span> {{ product.authorName }} {{ product.authorLastname }}</span></li>
                <!-- <li><b>Почта</b> <span>01 day shipping. </span></li>
                <li><b>Weight</b> <span>0.5 kg</span></li> -->
            </ul>
        </div>
    </div>
</template>
<script>
import $ from "jquery";
import { mapState } from "vuex";
import { currencyFilter } from "../utils/mixins";
export default {
  mixins: [currencyFilter],
  props: {
    initialProduct: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      product: this.initialProduct,
      quantity: 0,
      CreatedRoom: 0
    };
  },
  computed: {
    ...mapState(["currentUser", "isProcessing"]),
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    formData() {
      const { quantity } = this;
      return {
        productId: this.product.id,
        authorId: this.product.authorId,
        quantity
      };
    },
    currentURL() {

      let path = this.$route.path;
      return path;

    }
  },
  watch: {
    initialProduct(product) {
      this.product = {
        ...this.product,
        ...product
      };
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
    async addRoom(productId) {
      try {
        await this.$store.dispatch("addRoom", productId);
        this.product = {
          ...this.product
        };
      } catch (error) {
        return false;
      }
      this.$router.push({ path : '/users/room' });
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

    heartToggle() {
      $('[data-toggle="popover"]').popover();
    }
  }
};
</script>
<style lang="css" scoped>
#sharing-icon {
  cursor: pointer;
}
</style>
