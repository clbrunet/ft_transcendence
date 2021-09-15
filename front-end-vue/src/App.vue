<template>
  <div id="app">
    <div id="nav">
      <template v-if="is_auth">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/users">Users</router-link>
        <router-link to="/chats">Chats</router-link>
        <button v-bind:disabled="is_disconnecting" id="btn-disconnect" @click="logout">Disconnect</button>
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
import io from "socket.io-client"

export default Vue.extend({
  name: "App",
  store: Store,
  data() {
    return {
      mounted: false,
      is_disconnecting: false,
      socket: undefined as any
    };
  },
  methods: {
    logout() {
      this.is_disconnecting = true;
      axios({
        method: "post",
        url: `${ process.env.VUE_APP_API_URL }/authentication/log-out`,
        withCredentials: true
      })
      .then(() => {
        this.$store.state.expired = undefined;
        this.$store.state.user = undefined;
        this.$store.state.goDM = undefined;
        this.$store.dispatch("unauthenticate");
        router.push({ name: "App" });
      });
      this.is_disconnecting = false;
    }
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth;
    }
  },
  mounted() {
    this.$store.state.socket = io("http://localhost:3000");

    this.$store.state.socket.on('duelIsAccepted', (data: any) => {
      const path = "/duel/" + data.duelId;
      router.push({path: path});
    });
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
  justify-content: space-around;
  border-bottom: 1px solid black;
  background-color: #3040F0;
  height: 8vh;
  margin: 0;
  padding: 0;
}

#nav a {
  font-weight: bold;
  padding: 15px;
  border-radius: 10px;
  color:white;
}

#nav a:hover {
  background-color: white;
  color: #3040F0;
}

#nav a.router-link-exact-active {
  color: #3040F0;
  background-color:white;
  margin:15px;
  border-radius: 10px;
}

#btn-disconnect {
  text-decoration: underline;
  font-size: 15px;
  font-weight: 700;
  width: 90px;
  border-radius: 10px;
  height: 40px;
  color: #fff;
  cursor: pointer;
  background-color:#3040F0;
  outline:none;
  border:none;
  margin:15px;
}


#btn-disconnect:hover {
  background-color: white;
  color: #3040F0;
}

</style>
