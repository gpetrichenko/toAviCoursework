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
                  <adminNavigation/>
                </div>
                <div class="col-md-9">
                  <div class="panel panel-default ">
                    <div class="panel-heading main-color-bg">
                    </div>
                    <div class="panel-body">
                      <div class="table-responsive-md">
                        <table class="table table-striped">
                          <thead class="thead-dark">
                            <tr >
                              <th scope="col" class="textac">Имя</th>
                              <th scope="col" class="textac">Фамилия</th>
                              <th scope="col" class="textac">Email</th>
                              <th scope="col" class="textac">Роль</th>
                              <th scope="col" class="textac">Управление ролью</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="user in users" :key="user.id">
                              <td scope="col" class="textac">{{user.name}}</td>
                              <td scope="col" class="textac">{{user.lastname}}</td>
                              <td scope="col" class="textac">{{user.email}}</td>
                              <td scope="col" class="textac">
                                <div v-show="user.isEditing">
                                  <div class="input-group">
                                    <select class="custom-select" v-model="user.role">
                                      <option>user</option>
                                      <option>moderator</option>
                                      <option>admin</option>
                                    </select>
                                  </div>
                                </div>
                                <div v-show="!user.isEditing">{{user.role}}</div>
                              </td>
                              <td scope="col" class="textac">
                                <div v-if="user.isSelf"></div>
                                <div v-else>
                                  <div v-show="user.isEditing">
                                    <button class="btn btn-outline-dark btn-sm" @click="updateUserRole(user.id)">Done</button>
                                  </div>
                                  <div v-show="!user.isEditing">
                                    <button
                                    class="btn btn-outline-dark btn-sm"
                                    @click.stop.prevent="editUserRole(user.id)"
                                    >Edit</button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <nav v-if="totalPage > 1" aria-label="Page navigation">
                          <ul class="pagination">
                            <li v-show="previousPage" class="page-item">
                              <router-link
                              class="page-link"
                              aria-label="Previous"
                              :to="{name: 'adminUsers', query: { page: previousPage }}"
                              >
                              <span aria-hidden="true">&laquo;</span>
                            </router-link>
                          </li>
                          <li
                          v-for="page in totalPage"
                          :key="page"
                          :class="['page-item', { active: currentPage === page }]"
                          >
                          <router-link class="page-link" :to="{name: 'adminUsers', query: { page }}">{{ page }}</router-link>
                        </li>
                        <li v-show="nextPage" class="page-item">
                          <router-link
                          class="page-link"
                          :to="{name: 'adminUsers', query: { page: nextPage }}"
                          aria-label="Next"
                          >
                          <span aria-hidden="true">&raquo;</span>
                        </router-link>
                      </li>
                    </ul>
                  </nav>
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
import adminNavigation from "./../components/AdminNavigation";
import adminAPI from "./../apis/admin";
import { Toast } from "./../utils/helpers";

export default {
  components: {
    adminNav,
    adminNavigation
  },
  data() {
    return {
      users: [],
      currentPage: 0,
      totalPage: 0
    };
  },
  created() {
    const { page } = this.$route.query;
    this.fetchUsers({ page });
  },
  beforeRouteUpdate(to, from, next) {
    const { page } = to.query;
    this.fetchUsers({ page });
    next();
  },
  computed: {
    previousPage() {
      return this.currentPage === 1 ? null : this.currentPage - 1;
    },
    nextPage() {
      return this.currentPage + 1 > this.totalPage
      ? null
      : this.currentPage + 1;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  methods: {
    async fetchUsers({ page = 1 }) {
      try {
        this.$store.dispatch("updateLoading", true);
        const { data, statusText } = await adminAPI.users.get({
          page
        });
        console.log(data);
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.users = data.users.rows;
        this.users = this.users.map(user => {
          if (user.id == this.$store.state.currentUser.id) {
            return {
              ...user,
              isEditing: false,
              isSelf: true
            }
          }
          return {
            ...user,
            isEditing: false,
            isSelf: false
          }
        })
        console.log(11, this.users)
        this.currentPage = data.page;
        this.totalPage = data.totalPage.length;
        this.$store.dispatch("updateLoading", false);
      } catch (error) {
        this.$store.dispatch("updateLoading", false);
        Toast.fire({
          icon: "error",
          title: "Не получается получить информацию"
        });
      }
    },
    editUserRole (userId) {
      this.users = this.users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            isEditing: true
          }
        }
        return user
      })
    },
    async updateUserRole (userId) {
      let userRole = ''

      this.users = this.users.map(user => {
        if (user.id === userId) {
          userRole = user.role
          return {
            ...user,
            isEditing: false
          }
        }
        return user
      })

      const { statusText } = await adminAPI.users.putUser({
        id: userId,
        role: userRole
      })

      if (statusText === 'OK') {
        Toast.fire({
          type: 'success',
          title: 'Роль обновлена！'
        })
      }

      this.fetchUsers()
    }
  }
};
</script>
