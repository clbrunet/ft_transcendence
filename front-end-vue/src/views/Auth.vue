<template >
  <div id="body">
    <form @submit.prevent="login">
      <input type="text" v-model="loginCode" placeholder="Enter you double authentication code here">
      <input v-bind:disabled="is_logging_in" type="submit" value="Log-in">
    </form>
    <span class="error" v-if="errorCode"> {{ errorCode }} </span>
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

.error {
  color:red;
}

#body {
  display:flex;
  flex-direction: column;
  align-items:center;
  width: 50%;
}

</style>
