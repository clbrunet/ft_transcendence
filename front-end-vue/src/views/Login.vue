<template>
  <div class="login">
    <h1>This is the login page</h1>
    <form @submit.prevent="submit_login">
      <input type="email" placeholder="entrez votre email" v-model="email">
      <input type="password" placeholder="entrez votre mot de passe" v-model="password">
      <input type="submit" value="Valider">
    </form>
    <p class="error" v-for="(message, index) in messages" :key="index"> {{ message }} </p>
    <a href="https://api.intra.42.fr/oauth/authorize?client_id=9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth-forty-two&response_type=code">
      <button>Sign in with 42</button>
    </a>
    <p> Not <a @click="goToRegister()">register</a> yet ?</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import router from "../router";

export default Vue.extend({
  name: 'Login',
  data() {
    return {
      email: "",
      name: "",
      password: "",
      messages: [""]
    }
  },
  methods: {
    async submit_login() {
      if (this.email == "")
      {
        this.messages = ['email should not be empty'];
        return ;
      }
      if (this.password == "")
      {
        this.messages = ['password should not be empty'];
        return ;
      }

      try {
        const res = await axios.post('http://localhost:3000/authentication/log-in', {
          email: this.email,
          password: this.password
        }, { withCredentials: true });
        this.$store.state.user = res.data;
        this.$store.dispatch('authenticate');
        router.push({ name: "Profile" });
      }
      catch (error) {
        this.messages = Array.isArray(error.response.data.message) ? error.response.data.message : [error.response.data.message];
      }
    },
    goToRegister() {
      router.push({name: 'Register'});
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
