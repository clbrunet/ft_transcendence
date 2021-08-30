<template>
  <div class="login">
    <h1>This is the login page</h1>
    <form @submit.prevent="submit_login">
      <input type="email" placeholder="entrez votre email" v-model="email">
      <input type="password" placeholder="entrez votre mot de passe" v-model="password">
      <input type="submit" value="Valider">
      <p> {{ messages }} </p>
    </form>
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
      messages: ""
    }
  },
  methods: {
    submit_login() {
      if (this.email == "")
      {
        this.messages = 'email should not be empty';
        return ;
      }
      if (this.password == "")
      {
        this.messages = 'password should not be empty';
        return ;
      }

      axios({
        url: "http://localhost:3000/authentication/log-in" ,
        method: "post",
        data: {
          email: this.email,
          password: this.password
        },
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
        withCredentials: true
      }).then(() => {
        this.$store.dispatch('authenticate');
        router.push({ name: "Profile" });
      }).catch(() => {
        this.messages = "email or password are not valid";
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

