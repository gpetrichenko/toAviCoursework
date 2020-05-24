import Vue from "vue";
import VueRouter from "vue-router";
import notFound from "../views/notFound.vue";
import Index from "../views/index.vue";
import userProducts from "../views/userProducts";
import Product from "../views/product";
import adminCategories from "../views/adminCategories";
import adminProduct from "../views/adminProduct";
import adminProducts from "../views/adminProducts";
import adminProductEdit from "../views/adminProductEdit";
import adminProductCreate from "../views/adminProductCreate";
import userChangePassword from "../views/userChangePassword";
import userProduct from "../views/userProduct";
import userProductEdit from "../views/userProductEdit";
import userProductCreate from "../views/userProductCreate";



import moderatorProduct from "../views/moderatorProduct";
import moderatorProductEdit from "../views/moderatorProductEdit";
import moderatorProductCreate from "../views/moderatorProductCreate";
import moderatorProducts from "../views/moderatorProducts";

import adminUsers from "../views/adminUsers";
import userEdit from "../views/userEdit";

import userWishList from "../views/userWishList";
import userRooms from "../views/userRooms";
import userRoom from "../views/UserRoom";
import signIn from "../views/signIn";
import user from "../views/user";
import store from "../store";




Vue.use(VueRouter);

const authorizeIsAdmin = (to, from, next) => {
  const currentUser = store.state.current;
  if (currentUser && !currentUser.role) {
    next("/404");
    return;
  }
  next();
};

const authorizeIsModerator = (to, from, next) => {
  const currentUser = store.state.current;
  if (currentUser && !currentUser.role) {
    next("/404");
    return;
  }
  next();
};

const routes = [
  {
    path: "/",
    name: "root",
    redirect: "/index"
  },
  {
    path: "/signIn",
    name: "signIn",
    component: signIn
  },
  {
    path: "/index",
    name: "index",
    component: Index
  },
  {
    path: '/index/search',
    name: 'search',
    component: () => import('../views/Search.vue')
  },
  {
    path: "/products/:id",
    name: "product",
    component: Product
  },
  {
    path: "/users/",
    name: "users",
    component: user,
    children: [
      {
        path: "products",
        name: "userProducts",
        component: userProducts
      },
      {
        path: "products/:id/edit",
        name: "userProductEdit",
        component: userProductEdit
      },
      {
        path: "password_change",
        name: "userChangePassword",
        component: userChangePassword
      },
      {
        path: "products/create",
        name: "adminProductCreate",
        component: userProductCreate
      },
      {
        path: "products/:id",
        name: "userProduct",
        component: userProduct
      },
      {
        path: "edit",
        name: "userEdit",
        component: userEdit
      },
      {
        path: "wishlist",
        name: "userWishList",
        component: userWishList
      },
      {
        path: "room",
        name: "userRooms",
        component: userRooms
      },
      {
        path: 'rooms/:id',
        name: 'userRoom',
        component: userRoom
      }
    ]
  },
  {
    path: "/admin/categories",
    name: "adminCategories",
    component: adminCategories,
    beforeEnter: authorizeIsAdmin
  },
  {
    path: "/admin/users",
    name: "adminUsers",
    component: adminUsers,
    beforeEnter: authorizeIsAdmin
  },
  {
    path: "/admin/products",
    name: "adminProducts",
    component: adminProducts,
    beforeEnter: authorizeIsAdmin
  },
  {
    path: "/admin/products/:id/edit",
    name: "adminProductEdit",
    component: adminProductEdit,
    beforeEnter: authorizeIsAdmin
  },
  {
    path: "/admin/products/create",
    name: "adminProductCreate",
    component: adminProductCreate,
    beforeEnter: authorizeIsAdmin
  },
  {
    path: "/admin/products/:id",
    name: "adminProduct",
    component: adminProduct,
    beforeEnter: authorizeIsAdmin
  },
  {
    path: "/moderator/products",
    name: "moderatorProducts",
    component: moderatorProducts,
    beforeEnter: authorizeIsModerator
  },
  {
    path: "/moderator/products/:id/edit",
    name: "moderatorProductEdit",
    component: moderatorProductEdit,
    beforeEnter: authorizeIsModerator
  },
  {
    path: "/moderator/products/create",
    name: "moderatorProductCreate",
    component: moderatorProductCreate,
    beforeEnter: authorizeIsModerator
  },
  {
    path: "/moderator/products/:id",
    name: "moderatorProduct",
    component: moderatorProduct,
    beforeEnter: authorizeIsModerator
  },
  {
    path: "*",
    name: "notFound",
    component: notFound
  }
  // {
  //   path: '/room/:id',
  //   name: 'room',
  //   component: () => import('../views/UserRoom.vue')
  // }

];

const router = new VueRouter({
  linkExactActiveClass: "active",
  routes
});

router.beforeEach(async (to, from, next) => {
  const tokenInLocalStorage = localStorage.getItem("token");
  const tokenInStore = store.state.token;
  let isAuthenticated = store.state.isAuthenticated;
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch("fetchCurrentUser");
  }
  const pathsWithoutAuthentication = [
    "signIn",
    "index",
    "products"
  ];
  if (pathsWithoutAuthentication.includes(to.name)) {
    next();
    return;
  }
  if (!isAuthenticated && to.name !== "sign-in") {
    next("/signin");
    return;
  }
  if (isAuthenticated && to.name === "sign-in") {
    next("/products");
    return;
  }

  next()
})

export default router;
