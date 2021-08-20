<template>
  <div class="login">
    <h1>This is the login page</h1>
    <button @click="authenticate">Authenticate</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '../store';
import router from "../router";

export default Vue.extend({
  name: 'Login',
  store,
  computed: {
    is_auth() {
      return this.$store.state.is_auth
    }
  },
  methods: {
    authenticate() {
      this.$store.dispatch('authenticate');
      router.push({ name: "home" });
    }
  }
});
</script>

