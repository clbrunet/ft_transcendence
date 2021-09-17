<template>
  <div id="body">
    <div class="pongGame">
      <form @submit.prevent="submit_register">
        <input type="email" required placeholder="your email" v-model="email" />
        <input type="text" required placeholder="your name" v-model="name" />
        <input type="password" required placeholder="your password" v-model="password" />
        <input type="password" required placeholder="confirm your password" v-model="confirmPassword" />
        <input v-bind:disabled="is_registering" type="submit" value="Register"/>
        <p class="error"> {{ this.message }}</p>
        <p class="notLogin"> Already have an account ? <a @click="goToLogin()">login</a> now </p>
      </form>
      <a class="api42" v-bind:href="authorize_url_42">
        <button class="api42-button">Sign in with 42</button>
      </a>
      <div class="ball">
      </div>
      <div class="bar1">
      </div>
      <div class="bar2">
      </div>
      <div class="dotted-line">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
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
      message: "",
      authorize_url_42: process.env.VUE_APP_AUTHORIZE_URL_42,
      is_registering: false,
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
        this.message = "passwords do not match";
        return;
      }
      try {
        this.is_registering = true;
        await axios.post(`${ process.env.VUE_APP_API_URL }/authentication/register`, {
          email: this.email,
          name: this.name,
          password: this.password
        }, { withCrenditals: true });
      }
      catch (error) {
        let messages = Array.isArray(error.response.data.message) ? error.response.data.message : [error.response.data.message];
        this.message = "";
        messages.forEach(message => {
          this.message += message + "; ";
        });
        this.is_registering = false;
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
#body {
  width: 100%;
  height: 91vh;
  display:flex;
  align-items:center;
  justify-content: center;
  background-color: rgb(250, 99, 137);
}

.ball {
  position:absolute;
  width: 40px;
  height: 40px;
  background-color:white;
  border-radius: 100%;
  box-shadow: 3px 0 1px 0px #aaa;
  top: 56%;
  right: 12%;
}

.bar1, .bar2 {
  position:absolute;
  width: 1.5%;
  height: 21%;
  background-color:#ff4675;
  box-shadow: 8px 0 1px 0px #ef2356;
}

.bar1 {
  left: 5%;
  top: 10%;
}

.bar2 {
  right: 5%;
  bottom:17%;
}

.pongGame {
  background-color:#3040F0;
  width: 75vw;
  height: 75vh;
  border: 21px solid white;
  position: relative;
  display: flex;
  justify-content: center;
  align-items:center;
}

form {
  z-index: 200;
  position:absolute;
  width: 90%;
  height:50%;
  top: 20%;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
}

input {
  text-align: center;
  background-color :white;
  font-size:20px;
  border:none;
  outline:none;
  border-radius:8px;
  padding: 10px;
  margin-top: 25px;
}

input[type=submit] {
  cursor:pointer;
  background-color: #7583FF;
  border: 2px solid white;
  color:white;
  font-weight: 700;
  font-size:20px;
}

input[type=submit]:hover {
  background-color: rgb(87, 104, 250);
}

.dotted-line {
  z-index: 100;
  position: absolute;
  left: 49.75%;
  height: 100%;
  width: 0.5%;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
}

.notLogin {
  color:white;
}

.api42 {
  z-index: 200;
  position:absolute;
  top: 87%;
}

.api42-button {
  cursor:pointer;
  background-color: #7583FF;
  border: 2px solid white;
  color:white;
  outline:none;
  border-radius:8px;
  padding: 10px;
  font-weight: 700;
  font-size:20px;
}

.api42-button:hover {
  background-color: rgb(87, 104, 250);
}

.error {
  color:red;
  margin: 0;
  margin-top: 15px;
}

a{
  text-decoration: underline;
  color:blue;
  cursor:pointer;
}

.dot {
  background-color: rgba(255, 255, 255, 0.59);
  height: 13%;
  width: 100%;
}
</style>

