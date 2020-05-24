<template>
<div class="container pt-5">
  <section class="breadcrumb-section set-bg" data-setbg="img/breadcrumb.jpg" style="background-image: url(data:image/jpeg;base64,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);">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <div class="breadcrumb__text">
                        <h2>Панель администратора</h2>
                    </div>
                </div>
            </div>
        </div>
    </section>
  <!-- <ul class="nav nav-tabs mb-4 mt-2">
    <li class="nav-item">
      <router-link :to="{name:'adminProducts'}" class="nav-link">Товары</router-link>
    </li>
    <li class="nav-item">
      <router-link :to="{name:'adminUsers'}" class="nav-link">Пользователи</router-link>
    </li>
    <li class="nav-item">
      <router-link :to="{name:'adminCategories'}" class="nav-link">Категории</router-link>
    </li>
  </ul> -->
  <p></p>
</div>
</template>
