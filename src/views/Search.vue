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
            <div class="col-lg-12 herosearch mt-2 mb-3"><h4>Результаты по запросу {{searchText}}</h4></div>
            <!-- <div class="col-lg-12">
            <div class="featured__controls">
            <ProductsNavPills :categories="categories" />
          </div>
        </div> -->
      </div>
    </center>
    <div class="row featured__filter">
      <productCard
      v-for="product in postsResult"
      :key="product.id"
      :initial-product="product"
      :card-height="productCardHeight"
      />
    </div>
  </div>
  <!-- <RestaurantsPagination
  v-if="totalPage > 1"
  :current-page="currentPage"
  :total-page="totalPage"
  /> -->
</section>
</body>
</template>

<script>
import productCard from "./../components/productCard";
import { Toast } from "./../utils/helpers";
// import RestaurantsPagination from '@/components/RestaurantsPagination'
// import ProductsNavPills from '@/components/ProductsNavPills'
import productsAPI from '@/apis/products'
import { fromNowFilter } from '@/utils/mixins'
// import SearchFocus from './SearchFocus'
export default {
  components: {
    productCard

    // RestaurantsPagination,
    // ProductsNavPills
  },
  mixins: [fromNowFilter],
  name: 'Search',
  data() {
    return {
      searchText: '',
      postsResult: [],
      productCardHeight: 31.5
    }
  },
  methods: {
    async fetchThemes(searchText) {
      const { data } = await productsAPI.searchPost(searchText)
      this.postsResult = data.products
    },
    search() {
      this.searchText = this.searchText.trim()
      if (this.searchText === '') {
        Toast.fire({
          icon: 'warning',
          title: 'Пожалуйста введите в поиске то, что вы хотите найти'
        })
      } else {
        this.$router.push(`/index/search?q=${this.searchText}`)
      }
    }
  },

  created() {
    this.searchText = this.$router.currentRoute.query.q
    this.fetchThemes(this.searchText)
  },
  beforeRouteUpdate(to) {
    this.searchText = to.query.q
    this.fetchThemes(this.searchText)
  },

}
</script>
<!--
<style>
h6 {
margin-top: 10px;
}

#search {
max-width: 1000px;
margin: 0 auto;
}

#search-text-box {
padding-bottom: 40px;
}

#search-text {
font-size: 56px;
border: none;
border-bottom: 1.5px solid #aaa;
width: 100%;
}

#themes {
margin: 20px 0 25px 0;
border-bottom: 1px solid #ccc;
max-width: 750px;
}


#info :first-child span {
font-size: 15px;
color: rgb(3, 168, 124);
cursor: pointer;
}

#info :first-child:hover {
color: green;
}

#info :last-child {
font-size: $text-small;
color: #666;
}

#cover {
margin: 31px 0;
}

#read-more {
color: #666;
margin-bottom: 20px;
}

@media screen and (max-width: 720px) {
#search {
margin: 0 30px;
}

img {
width: 100%;
height: auto;
}
}
</style> -->
