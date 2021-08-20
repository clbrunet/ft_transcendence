<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link v-if="is_auth" to="/profile">Profile</router-link>
      <router-link v-else to="/login">Login</router-link>
    </div>
    <router-view/>
    <p>is_auth : {{ is_auth }} </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from './store/index';

export default Vue.extend({
  name: 'App',
  store: Store,
  data() {
    return {
    };
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
</style>
