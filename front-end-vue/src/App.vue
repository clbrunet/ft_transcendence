<template>
  <div id="app">
    <div id="nav">
      <router-link to="/home">Home</router-link>
      <template v-if="is_auth">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/chats">Chats</router-link>
        <button id="btn-disconnect" @click="logout">Disconnect</button>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Store from "./store/index";
import axios from "axios";
import router from "./router";

export default Vue.extend({
  name: "App",
  store: Store,
  data() {
    return {};
  },
  methods: {
    logout() {
      axios({
        method: "post",
        url: "http://localhost:3000/authentication/log-out",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000"
        },
        withCredentials: true
      })
      .then(res => {
          console.log(res);
          this.$store.dispatch("unauthenticate");
      })
      .catch(err => {
          console.log(err);
      });
    }
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth;
    }
  },
  mounted() {
    axios({
      method: "get",
      url: "http://localhost:3000/authentication",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000"
      },
      withCredentials: true
    })
      .then(() => {
        this.$store.dispatch("authenticate");
      })
      .catch(() => {
        this.$store.dispatch("unauthenticate");
        router.push({ name: "Home" });
      });
  }
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

#nav {
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: space-between;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 15px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#btn-disconnect {
  width: 90px;
  height: 40px;
  cursor: pointer;
}
</style>
