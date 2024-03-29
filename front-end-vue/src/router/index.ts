import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '../store';
import axios from 'axios';
import PortalVue from 'portal-vue'

Vue.use(PortalVue)


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/profile/',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/profile/:id',
    name: 'ProfileId',
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
    path: '/oauth-forty-two',
    name: 'OAuthFortyTwo',
    component: () => import('../views/OAuthFortyTwo.vue'),
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
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: {
      hideForAuth: true
    }
  },
  {
    path: '/duel/:id',
    name: 'Duel',
    component: () => import('../views/Duel.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/spectate',
    name: 'Spectate',
    component: () => import('../views/Spectate.vue'),
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
  axios.get(process.env.VUE_APP_API_URL + "/authentication", { withCredentials: true })
    .then(res => {
      store.state.is_auth = true;
      store.state.user = res.data;
      if (to.matched.some((record) => record.meta.hideForAuth)) {
        return next('/profile');
      }
      if (res.data.admin !== true && to.matched.some((record) => record.meta.requiresAdmin)) {
        return next('/profile');
      }
    })
    .catch(() => {
      store.state.is_auth = false;
      store.state.user = {};
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        return next('/login');
      }
    });
  return next();
});

export default router;
