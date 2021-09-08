<template>
  <div id="body">
    <div class="pongGame">
      <form @submit.prevent="submit_login">
        <input type="email" placeholder="your email" v-model="email">
        <input type="password" placeholder="your password" v-model="password">
        <input type="submit" value="Log-in">
        <p class="error" v-for="(message, index) in messages" :key="index"> {{ message }} </p>
        
        <a href="https://api.intra.42.fr/oauth/authorize?client_id=9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth-forty-two&response_type=code">
          <button class="api42">Sign in with 42</button>
        </a>
        <p class="notRegistered"> Not <a @click="goToRegister()">registered</a> yet ?</p>
      </form>
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
        const res = await axios.post(`${ process.env.VUE_APP_API_URL }/authentication/log-in`, {
          email: this.email,
          password: this.password
        }, { withCredentials: true });
        if (res.data != "")
        {
          this.$store.state.user = res.data;
          this.$store.dispatch('authenticate');
          router.push({ name: "Profile" });
        }
        else
        {
          router.push({ name: "Auth" });
        }
      }
      catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          this.messages = Array.isArray(error.response?.data.message) ? error.response?.data.message : [error.response?.data.message];
        }
      }
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
}

form {
  z-index: 200;
  position:absolute;
  width: 60%;
  left:20%;
  height:50%;
  top: 25%;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
}

input {
  text-align: center;
  font-size:20px;
  border:none;
  outline:none;
  border-radius:8px;
  padding: 15px;
  margin:15px;
  width: 40%;
}

input[type=submit] {
  cursor:pointer;
  background-color: #7583FF;
  border: 2px solid white;
  color:white;
  font-weight: 700;
  font-size:20px;
  width: 20%;
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
  color:white;
}

.api42 {
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

.api42:hover {
  background-color: rgb(87, 104, 250);
}

.dot {
  background-color: rgba(255, 255, 255, 0.59);
  height: 13%;
  width: 100%;
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
