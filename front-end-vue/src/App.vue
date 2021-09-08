<template>
  <div id="app">
    <div id="nav">
      <template v-if="is_auth">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/users">Users</router-link>
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
/* eslint-disable */

import Vue from "vue";
import Store from "./store/index";
import axios from "axios";
import router from "./router";
import io from "socket.io-client";

export default Vue.extend({
  name: "App",
  store: Store,
  data() {
    return {
      mounted: false,
    };
  },
  methods: {
    logout() {
      axios({
        method: "post",
        url: `${ process.env.VUE_APP_API_URL }/authentication/log-out`,
        withCredentials: true
      })
      .then(() => {
        this.$store.state.expired = undefined;
        this.$store.state.user = undefined;
        this.$store.state.socket = undefined;
        this.$store.dispatch("unauthenticate");
        router.push({ name: "App" });
      })
    }
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth;
    }
  },
  mounted() {
    this.$store.state.socket = io("http://localhost:3012");
    console.log("Ok : ", this.$store.state.socket);
  }
});
</script>

<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  height:100vh;
}

#nav {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid black;
  height: 8vh;
  margin: 0;
  padding: 0;
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
