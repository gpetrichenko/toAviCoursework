<template>
  <ul>
      <li ><router-link style="color:black;" :to="{ name: 'index' }" exact>Все</router-link></li>
      <li v-for="category in categories" :key="category.id">
        <router-link
        style="color:black;"
        class="nav-link"
        :to="{ name: 'index', query: { categoryId: category.id } }"
      >{{ category.name }}
    </router-link>
  </li>
  </ul>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
.a {
  color: #1C1C1C;
}
</style>
