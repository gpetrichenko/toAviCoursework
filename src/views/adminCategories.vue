<template>
  <div>
    <template>
      <div>
        <div>
          <nav class="navbar navbar-default">
            <div class="container">
              <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav navbar-block navbar-left">
                  <li><a>Dashboard</a></li>
                  <li><a>Pages</a></li>
                  <li><a>Posts</a></li>
                  <li><a>Users</a></li>
                </ul>
                <ul class="nav navbar-nav navbar-block navbar-right">
                  <li><a>Welcome, User</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </div>
            </div>
          </nav>
          <header id="header">
            <div class="container">
              <div class="row">
                <adminNav />
              </div>
            </div>
          </header>
          <section id="main">
            <div class="container">
              <div class="row">
                <div class="col-md-3">
                  <div class="list-group">
                    <adminNavigation/>
                          <a class="nav-main-color list-group-item mb-1 textac" style="color:white">
                            Функции
                          </a>
                          <a class="mb-1 textac">Название категории: </a>
                          <a class="mb-1"><div class="col-auto mb-1">
                            <input
                            v-model="newCategoryName"
                            type="text"
                            class="form-control textac btn-block"
                            required
                            placeholder="Название"
                            />
                          </div>
                          <div class="col-auto">
                            <button
                            type="button"
                            class="btn btn-outline-primary btn-block"
                            @click.stop.prevent="createCategory"
                            :disabled="isProcessing"
                            >Создать</button>
                          </div></a>
                        </div>
                      </div>
                      <div class="col-md-9">
                        <div class="panel panel-default ">
                          <div class="panel-heading main-color-bg">
                          </div>
                          <div class="panel-body">
                            <div class="table-responsive-md">
                              <table class="table table-striped">
                                <thead class="thead-dark">
                                  <tr>
                                    <th scope="col" class="textac">Название категории</th>
                                    <th scope="col" class="textac">Изменение</th>
                                    <th scope="col" class="textac">Удаление</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="category in categories" :key="category.id">
                                    <td scope="col" class="textac">
                                      <div v-show="!category.isEditing" class="category-name">{{ category.name }}</div>
                                      <input
                                      v-show="category.isEditing"
                                      v-model="category.name"
                                      type="text"
                                      class="form-control"
                                      required="required"
                                      />
                                      <span
                                      v-show="category.isEditing"
                                      class="cancel"
                                      @click="handleCancel(category.id)"
                                      >✕</span>
                                    </td>
                                    <td scope="col" class="textac">
                                      <button
                                      v-if="!category.isEditing"
                                      class="btn btn-outline-dark"
                                      @click.stop.prevent="toggleIsEditing(category.id)"
                                      :disabled="isProcessing"
                                      >Изменить</button>
                                      <button
                                      v-if="category.isEditing"
                                      class="btn btn-dark"
                                      @click.stop.prevent="editCategory({categoryId: category.id, category:category.name})"
                                      :disabled="isProcessing"
                                      >Сохранить</button>
                                    </td>
                                    <td scope="col" class="textac">
                                      <button
                                      type="button"
                                      class="btn btn-outline-danger"
                                      @click.stop.prevent="deleteCategory(category.id)"
                                      :disabled="isProcessing"
                                      >Удалить</button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </template>
        </div>
      </template>

<script>
import adminNav from "./../components/adminNav";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";
import adminNavigation from "./../components/AdminNavigation";

export default {
  components: {
    adminNav,
    adminNavigation
  },

  data() {
    return {
      categories: [],
      newCategoryName: ""
    };
  },
  created() {
    this.fetchCategories();
  },
  computed: {
    isProcessing() {
      return this.$store.state.isProcessing;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  methods: {
    async fetchCategories() {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await adminAPI.categories.get();

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.categories = data.categories.map(category => ({
          ...category,
          isEditing: false
        }));
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Не получилось получить категорию"
        });
      }
    },
    async createCategory() {
      try {
        if (!this.newCategoryName) {
          Toast.fire({
            icon: "warning",
            title: "Вы забыли ввести название категории"
          });
          return;
        }
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await adminAPI.categories.create({
          category: this.newCategoryName
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        this.categories.push({
          ...data.category,
          isEditing: false
        });
        this.newCategoryName = "";
        this.fetchCategories();
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Не получилось добавить новую категорию"
        });
      }
    },
    async editCategory({ categoryId, category }) {
      try {
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await adminAPI.categories.update({
          categoryId,
          category
        });

        if (statusText !== "OK" && data.status !== "success") {
          throw new Error(statusText);
        }

        this.toggleIsEditing(categoryId);
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Не получилось изменить категорию"
        });
      }
    },
    async deleteCategory(categoryId) {
      try {
        this.$store.dispatch("updateProcessing", true);
        const { data, statusText } = await adminAPI.categories.delete({
          categoryId
        });

        if (statusText !== "OK" && data.status !== "success") {
          throw new Error(statusText);
        }
        this.categories = this.categories.filter(
          category => category.id !== categoryId
        );
        this.$store.dispatch("updateProcessing", false);
      } catch (error) {
        this.$store.dispatch("updateProcessing", false);
        Toast.fire({
          icon: "error",
          title: "Категория не может быть удалена, до тех пор пока продукты ассоциируются с данной категорией"
        });
      }
    },
    toggleIsEditing(categoryId) {
      this.$store.dispatch("updateProcessing", true);
      this.categories = this.categories.map(category => {
        if (category.id !== categoryId) return category;

        return {
          ...category,
          nameCached: category.name,
          isEditing: !category.isEditing
        };
      });
      this.$store.dispatch("updateProcessing", false);
    },
    handleCancel(categoryId) {
      this.categories = this.categories.map(category => {
        if (category.id !== categoryId) {
          return category;
        }

        return {
          ...category,
          category: category.nameCached
        };
      });
      this.toggleIsEditing(categoryId);
    }
  }
};
</script>
