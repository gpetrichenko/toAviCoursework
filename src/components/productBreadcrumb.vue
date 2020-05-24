<template>
  <div class="col-12">
    <div class="breadcrumb-wrap"><nav aria-label="breadcrumb">
      <div class="breadcrumb-title">Информация о продукте</div><ul class="breadcrumb">
        <li class="breadcrumb-item"><router-link :to="{name:'index'}">Главная</router-link></li>
        <li class="breadcrumb-item active"><router-link :to="{name:'products'}">Товары</router-link></li>
        <li class="breadcrumb-item active"><router-link :to="{name:'index', query:{categoryId:path.categoryId}}">{{path.categoryName}}</router-link></li>
        <li aria-current="page" class="breadcrumb-item">{{path.name}}</li>
      </ul></nav></div>
</div>
</template>
<script>
export default {
  props: {
    path: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      product: this.path
    };
  }
};
</script>
