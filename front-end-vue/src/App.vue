<template>
  <div id="app">
    <div id="nav">
      <template v-if="is_auth">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/users">Users</router-link>
        <router-link to="/spectate">Spectate</router-link>
        <router-link to="/chats">Chats</router-link>
        <button v-bind:disabled="is_disconnecting" id="btn-disconnect" @click="logout">Disconnect</button>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
    <router-view v-bind:key="$route.fullPath"/>
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
      .then(async () => {
        await router.push({ name: "Home" });
        this.$store.state.user = undefined;
        this.$store.state.goDM = undefined;
        this.$store.state.duelId = undefined;
        this.$store.state.gameid = undefined;
        this.$store.state.gameid2 = undefined;
        this.$store.state.side = undefined;
        this.$store.state.inQueue = undefined;
        this.$store.dispatch("unauthenticate");
      })
      .catch(() => {
        alert("log-out failed, please retry after refreshing the page");
      });
      this.is_disconnecting = false;
    },
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth;
    }
  },
  mounted() {
    this.$store.state.socket = io(process.env.VUE_APP_API_URL);

    this.$store.state.socket.on('duelIsAccepted', (data: any) => {
      if (this.$store.state.user.id != undefined)
      {
        if (this.$store.state.user.id == data.id ||
          this.$store.state.user.id == data.ownerId)
        {
          const path = "/duel/" + data.duelId;
          this.$store.state.duelId = data.duelId;
          router.push({path: path}).catch(() => {
            console.log("Redirection...");
          })
        }
      }
    });
  },
});
</script>

<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  height:100vh;
  background-color: rgb(250, 99, 137);
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
  height: 80%;
  width: fit-content;
  padding: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
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
}


#btn-disconnect:hover {
  background-color: white;
  color: #3040F0;
}

@media (max-width: 400px) {
  #nav a {
    font-size: 13px;
  }
  #btn-disconnect {
    font-size: 13px;
  }
}
</style>
