<template >
  <div id="body">
    <template v-if="!$store.state.expired">
      <button v-bind:disabled="is_generating" @click="generate">Generate</button>
      <span v-if="loading != '' && QRCodeSRC == ''">{{ loading }}</span>
      <img v-if="QRCodeSRC != ''" :src="QRCodeSRC" alt="qr" />
    </template>
    <template v-else>
      <h1> {{ $store.state.expired }} </h1>
    </template>

    <form v-if="$store.state.expired || QRCodeSRC != ''" @submit.prevent="login">
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
      loading: "",
      QRCodeSRC: "",
      loginCode: "",
      errorCode: "",
      is_generating: false,
      is_logging_in: false,
    };
  },
  methods: {
    async generate() {
      this.is_generating = true;
      this.loading = "Loading...";
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/2fa/generate`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      this.QRCodeSRC = URL.createObjectURL(await response.blob());
      this.is_generating = false;
    },
    login() {
      this.errorCode = "";
      this.is_logging_in = true;
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
        this.is_logging_in = false;
        this.errorCode = "Wrong code.";
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
