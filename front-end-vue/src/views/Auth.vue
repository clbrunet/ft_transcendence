<template >
  <div id="body">
    <div class="verification">
      <h1>Verify your identity</h1>
      <form @submit.prevent="login">
        <input type="text" required v-model="loginCode" placeholder="Verification code">
        <input v-bind:disabled="is_logging_in" type="submit" value="Log-in">
      </form>
      <span class="error" v-if="errorCode"> {{ errorCode }} </span>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */

import Vue from "vue";
import axios from "axios";
import router from "../router";
export default Vue.extend({
  name: "Auth",
  data() {
    return {
      loginCode: "",
      errorCode: "",
      is_logging_in: false,
    };
  },
  methods: {
    login() {
      this.is_logging_in = true;
      this.errorCode = "";
      axios({
        url: `${ process.env.VUE_APP_API_URL }/2fa/authenticate/`,
        method: "post",
        data: {
          twoFactorAuthenticationCode: this.loginCode
        },
        withCredentials: true
      }).then(res => {
        if (this.$store.state.is_auth == false)
        {
          this.$store.state.user = res.data;
          this.$store.dispatch('authenticate');
        }
        router.push({name: 'Profile'});
      }).catch(() => {
        this.errorCode = "Wrong code.";
        this.is_logging_in = false;
      })
    }
  }
});
</script>

<style scoped>

#body {
  width: 100%;
  height: 92%;
  background-color: rgb(250, 99, 137);
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
}

.verification {
  transform: translateY(-8vh);
}

h1 {
  font-weight: normal;
  color: #3040F0;
}

form {
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

input {
  text-align: center;
  font-size: 20px;
  border:none;
  outline:none;
  border-radius:8px;
  padding: 15px;
  margin:15px;
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

.error {
  color:white;
}

</style>
