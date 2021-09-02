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
    <a href="https://api.intra.42.fr/oauth/authorize?client_id=9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth-forty-two&response_type=code">
      <button>Sign in with 42</button>
    </a>
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
      messages: []
    };
  },
  computed: {
    is_auth() {
      return this.$store.state.is_auth
    }
  },
  methods: {
    submit_register() {
      if (this.password != this.confirmPassword) {
        this.messages = { message: "passwords do not match" };
        return;
      }
      axios.post("http://localhost:3000/authentication/register",
        {
          email: this.email,
          name: this.name,
          password: this.password
        },
        {
          withCrenditals: true
        }
      ).then(res => {
          console.log(res);
          router.push({ name: "App" });
        })
        .catch(err => {
          this.messages = Array.isArray(err.response.data.message) ? err.response.data.message : [err.response.data.message];
        });
    }
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
</style>

