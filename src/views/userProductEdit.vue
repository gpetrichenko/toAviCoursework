<template>
  <div>
    <div v-if="isLoading">
      <Spinner />
    </div>
    <form v-else class="container mb-5" @submit.stop.prevent="handleSubmit($route.params.id)">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="name">Название</label>
          <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            v-model="product.name"
            placeholder="Название товара"
            required="required"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="categoryId">Категория</label>
          <select
            name="categoryId"
            id="categoryId"
            class="form-control"
            v-model="product.categoryId"
          >
            <option value disabled>Пожалуйста, выберите</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >{{ category.name }}</option>
          </select>
        </div>
        <div class="form-group col-md-2">
          <label for="status">Статус</label>
          <select name="status" id="status" class="form-control" v-model="product.status">
            <option value="on">Активно</option>
            <option value="off">Не активно</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="originPrice">Цена</label>
          <input
            type="text"
            name="sellPrice"
            id="sellPrice"
            class="form-control"
            placeholder="Цена"
            v-model="product.sellPrice"
            required="required"
          />
        </div>
        <div class="form-group col-md-12">
          <label for="description">Описание</label>
          <textarea
            name="description"
            id="description"
            class="form-control"
            cols="120"
            rows="3"
            placeholder="Описание"
            v-model="product.description"
          ></textarea>
        </div>
        <div class="form-group col-md-12">
          <label for="images">Изображения продукта</label>
          <input type="file" class="form-control" name="images" id="images" multiple="multiple" />
        </div>
      </div>
      <div class="container adminProductImg">
        <div class="row">
          <div class="prodcutImg col-md-3 mb-3" v-for="image in images" :key="image.id">
            <img :src="image.url" alt />
            <div class="mask" @click="deleteImage" :data-imageId="image.id">X</div>
          </div>
        </div>
      </div>
      <a href="#" class="btn btn-primary mx-3" @click="$router.go(-1)">Назад</a>
      <button type="submit" class="btn btn-outline-dark mx-3" :disabled="isProcessing">Подтвердить изменения</button>
    </form>
  </div>
</template>
<script>
import Spinner from "./../components/Spinner";
import userAPI from "./../apis/users";
import { Toast } from "./../utils/helpers";
export default {
  components: {
    Spinner
  },
  data() {
    return {
      product: {
        name: "",
        categoryId: "",
        sellPrice: 0,
        status: "",
        description: ""
      },
      images: [],
      categories: []
    };
  },
  created() {
    const { id } = this.$route.params;
    this.fetchAdminProduct(id);
    this.fetchAdminCategories();
  },
  computed: {
    isProcessing() {
      return this.$store.state.isProcessing;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchAdminProduct(id);
    next();
  },
  methods: {
    async fetchAdminProduct(id) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await userAPI.products.getProductDetail({
          id
        });
        if (statusText !== "OK" && data.status !== "success") {
          throw new Error(status);
        }
        this.product = {
          name: data.product.name,
          categoryId: data.product.CategoryId,
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
          title: "Невозможно получить информацию о товаре"
        });
      }
    },
    async fetchAdminCategories() {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await userAPI.categories.get();
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.categories = data.categories;
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Невозможно получить категории"
        });
      }
    },
    async handleSubmit(id) {
      try {
        if (
          !this.product.name ||
          !this.product.sellPrice ||
          !this.product.description
        ) {
          Toast.fire({
            icon: "warning",
            title: "Пожалуйста заполните все поля"
          });
          return;
        }
        this.$store.dispatch("updateProcessing", true);
        let e = window.event;
        const form = e.target;
        const formData = new FormData(form);

        const { data, statusText } = await userAPI.products.put({
          id,
          formData
        });

        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        this.$store.dispatch("updateProcessing", false);
        this.$router.push({ name: "userProducts" });
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Не удалось изменить информацию о продукте"
        });
      }
    },
    async deleteImage(e) {
      try {
        const { imageid } = e.target.dataset;
        const { data, statusText } = await userAPI.products.deleteImage(
          imageid
        );
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        this.images.splice(this.images.indexOf(imageid), 1);
        Toast.fire({
          icon: "success",
          title: "Изображениеу удалено"
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Не удалось удалить картинку"
        });
      }
    }
  }
};
</script>
<style scoped>
img {
  width: 100%;
  height: auto;
}
.adminProductImg .prodcutImg {
  position: relative;
}
.prodcutImg .mask {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: all 0.5s;
}
.prodcutImg .mask:hover {
  color: red;
  opacity: 1;
  font-size: 200px;
  cursor: pointer;
}
</style>
