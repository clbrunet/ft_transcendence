<template>
  <div class="OAuthFortyTwo">
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
