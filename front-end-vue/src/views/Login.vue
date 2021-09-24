<template>
  <div id="body">
    <div class="pongGame">
      <form @submit.prevent="submit_login">
        <input type="email" required placeholder="Email" v-model="email">
        <input type="password" required placeholder="Password" v-model="password">
        <input v-bind:disabled="is_logging_in" type="submit" value="Log-in">
        <p class="error" v-for="(message, index) in messages" :key="index"> {{ message }} </p>
        <p class="notRegistered"> Not <a @click="goToRegister()">registered</a> yet ?</p>
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
      messages: [""],
      authorize_url_42: process.env.VUE_APP_AUTHORIZE_URL_42,
      is_logging_in: false,
    }
  },
  methods: {
    async submit_login() {
      this.messages = [""];
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
        this.is_logging_in = true;
        const res = await axios.post(`${ process.env.VUE_APP_API_URL }/authentication/log-in`, {
          email: this.email,
          password: this.password
        }, { withCredentials: true });
        if (res.data != "")
        {
          this.$store.state.user = res.data;
          this.$store.dispatch('authenticate');
          return router.push({ name: "Profile" });
        }
        else
        {
          return router.push({ name: "Auth" });
        }
      }
      catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.messages = Array.isArray(error.response?.data.message) ? error.response?.data.message : [error.response?.data.message];
        }
      }
      this.is_logging_in = false;
    },
    goToRegister() {
      router.push({name: 'Register'});
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
  width: 75%;
  height: 75%;
  border: 21px solid white;
  position: relative;
  margin: auto;
  display: flex;
  align-items:center;
  justify-content: center;

}

form {
  z-index: 200;
  position:absolute;
  width: 80%;
  height:50%;
  top: 15%;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
}

input {
  text-align: center;
  width: 40%;
  max-width: 200px;
  font-size:20px;
  border:none;
  outline:none;
  border-radius:8px;
  padding: 15px;
  margin:0;
  margin-top: 25px;
}

input[type=submit] {
  max-width: 100px;
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

.notRegistered {
  color:black;
  background-color:white;
  margin:0;
  margin-top: 25px;
}

.api42 {
  z-index: 200;
  position:absolute;
  top: 75%;
}

.api42-button {
  cursor:pointer;
  background-color: #7583FF;
  border: 2px solid white;
  color:white;
  outline:none;
  border-radius:8px;
  padding: 15px;
  margin:15px;
  font-weight: 700;
  font-size:20px;
}

.api42-button:hover {
  background-color: rgb(87, 104, 250);
}

.dot {
  background-color: rgba(255, 255, 255, 0.59);
  height: 13%;
  width: 100%;
}

.error {
  color:red;
  margin:0;
  margin-top: 25px;
}

a{
  text-decoration: underline;
  color:blue;
  cursor:pointer;
}

</style>
