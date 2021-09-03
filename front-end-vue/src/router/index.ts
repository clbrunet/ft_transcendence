import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '../store';
import axios from 'axios';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/chats',
    name: 'Chats',
    component: () => import('../views/Chats.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


/* guards du routeur pour contrôler les routes */

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth))
  {
    axios({
      method: "get",
      url: "http://localhost:3000/authentication",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000"
      },
      withCredentials: true
    }).then(res => {
      store.state.is_auth = true;
      store.state.user = res.data;
      next();
      return ;
    }).catch(() => {
      next('/login');
    });
  }
  else
  {
    next();
  }


    axios({
      method: "get",
      url: "http://localhost:3000/authentication",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000"
      },
      withCredentials: true
    }).then(res => {
      if (to.matched.some((record) => record.meta.hideForAuth))
      {
        store.state.is_auth = true;
        store.state.user = res.data;
        next('/profile');
        return ;
      }
      else
      {
        next();
      }
    }).catch(() => {
      next();
    });
});

export default router
