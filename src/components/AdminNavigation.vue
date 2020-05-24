<template>
  <div class="list-group nav nav-pills">
    <a class="nav-main-color list-group-item textac" style="color:white">
      Навигация
    </a>
    <a class="nav-item list-group-item list-group-item-action textac">
      <router-link :to="{name:'adminProducts'}" >Товары</router-link> </a>
      <a class="nav-item list-group-item list-group-item-action textac">
        <router-link :to="{name:'adminUsers'}" >Пользователи</router-link></a>
        <a class="nav-item list-group-item list-group-item-action textac">
          <router-link :to="{name:'adminCategories'}" >Категории</router-link></a>
          <p></p>

        </div>
      </template>
