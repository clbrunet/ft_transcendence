<template>
  <div id="body" class="OAuthFortyTwo">
    <h1>Signing in...</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import router from '../router';

export default Vue.extend({
  name: 'OAuthFortyTwo',
  mounted: async function() {
    let code = this.$route.query.code
    if (code === undefined) {
      return router.push({ name: "Login" });
    }
    try {
      const { data } = await axios.post(`${ process.env.VUE_APP_API_URL }/authentication/fortyTwo?code=` + code, null, { withCredentials: true });
      if (data == "") {
        return router.push({ name: "Auth" });
      }
      this.$store.state.user = data;
      this.$store.dispatch('authenticate');
      return router.push({ name: "Profile" });
    }
    catch {
      alert('Something went wrong, please try again, or login with a local account')
      return router.push({ name: "Login" });
    }
  },
});

</script>

<style scoped>

#body {
  width: 100%;
  height: 92vh;
  display:flex;
  justify-content: center;
  align-items:center;
  background-color: rgb(250, 99, 137);
}

h1 {
  font-weight: normal;
  color: #3040F0;
  transform: translateY(-8vh);
}


</style>
