<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li v-show="previousPage" class="page-item">
        <router-link
          class="page-link"
          aria-label="Previous"
          :to="{name: 'index', query: { categoryId, page: previousPage }}" exact
        >
          <span aria-hidden="true">&laquo;</span>
        </router-link>
      </li>

      <li
        v-for="page in totalPage"
        :key="page"
        :class="['page-item', { active: currentPage === page }]"
      >
        <router-link
          class="page-link"
          :to="{name: 'index', query: { categoryId, page }}"
        >{{ page }}</router-link>
      </li>

      <li v-show="nextPage" class="page-item">
        <router-link
          class="page-link"
          aria-label="Next"
          :to="{name: 'index', query: { categoryId, page: nextPage }}"
        >
          <span aria-hidden="true">&raquo;</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    categoryId: {
      type: [String, Number],
      default: ''
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    previousPage() {
      return this.currentPage === 1 ? null : this.currentPage - 1
    },
    nextPage() {
      return this.currentPage + 1 > this.totalPage ? null : this.currentPage + 1
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-link {
  height: 37px;
  padding: 7px 20px;
  color: #252525;;
}

.page-item.active .page-link,
.page-item.active span {
  color: white;
  background-color: #252525;;
  border-color: #252525;;
  z-index: 1;
}

.page-item span {
  color: #252525;;
}

a.page-link:hover,
a.page-link:hover span {
  color: white;
  background-color: #252525;;
  border-color: #252525;;
}
</style>
