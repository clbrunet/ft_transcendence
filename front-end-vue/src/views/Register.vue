<template>
  <div class="login">
    <h1>This is the register page</h1>
    <form @submit.prevent="submit_register">
      <input type="email" placeholder="entrez votre email" v-model="email" />
      <input type="text" placeholder="entrez votre nom" v-model="name" />
      <input type="password" placeholder="entrez votre mot de passe" v-model="password" />
      <input type="password" placeholder="confirmez votre mot de passe" v-model="confirmPassword" />
      <input type="submit" value="Valider"/>
    </form>
    <p class="error" v-for="(message, index) in messages" :key="index"> {{ message }} </p>
    <a v-bind:href="authorize_url_42">
      <button>Sign in with 42</button>
    </a>
    <p> Already have an account ? <a @click="goToLogin()">login</a> now </p>
  </div>
</template>

<script>
//add lang="ts" and fix axiosConfig error. à faire plus tard #TO-DO

import Vue from "vue";
import axios from "axios";
import store from '../store';
import router from "../router";

export default Vue.extend({
  name: "Register",
  store,
  data() {
    return {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      messages: [],
      authorize_url_42: process.env.VUE_APP_AUTHORIZE_URL_42,
    };
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth
    }
  },
  methods: {
    async submit_register() {
      if (this.password != this.confirmPassword) {
        this.messages = { message: "passwords do not match" };
        return;
      }
      try {
        await axios.post(`${ process.env.VUE_APP_API_URL }/authentication/register`, {
          email: this.email,
          name: this.name,
          password: this.password
        }, { withCrenditals: true });
      }
      catch (error) {
        this.messages = Array.isArray(error.response.data.message) ? error.response.data.message : [error.response.data.message];
        return;
      }
      try {
        const { data } = await axios.post(`${ process.env.VUE_APP_API_URL }/authentication/log-in`, {
          email: this.email,
          password: this.password
        }, { withCredentials: true });
        this.$store.state.user = data;
        this.$store.dispatch('authenticate');
        return router.push({ name: "Profile" });
      }
      catch (error) {
        return router.push({ name: "Login" });
      }
    },
    goToLogin() {
      router.push({name: 'Login'});
    },
  }
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form input {
  width: 300px;
  padding: 10px;
  margin: 10px;
}

.error {
  color:red;
}

a{
  text-decoration: underline;
  color:blue;
  cursor:pointer;
}
</style>

