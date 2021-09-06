<template >
  <div id="body">
      <template v-if="!$store.state.expired">
        <button @click="generate">Generate</button>
        <span v-if="loading != '' && QRCodeSRC == ''">{{ loading }}</span>
        <img v-if="QRCodeSRC != ''" :src="QRCodeSRC" alt="qr" />
      </template>
      <template v-else>
          <h1> {{ $store.state.expired }} </h1>
      </template>

    <form v-if="$store.state.expired || QRCodeSRC != ''" @submit.prevent="login">
        <input type="text" v-model="loginCode" placeholder="Enter you google code here">
        <input type="submit" value="Log-in">
    </form>
    <span class="error" v-if="errorCode"> {{ errorCode }} </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import router from "../router";
export default Vue.extend({
  name: "Auth",
  data() {
    return {
      QRCodeSRC: "",
      loginCode: "",
      errorCode: ""
    };
  },
  methods: {
    async generate() {
      this.loading = "Loading...";
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/2fa/generate`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      this.QRCodeSRC = URL.createObjectURL(await response.blob());
    },
    login() {
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
        }).catch(err => {
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