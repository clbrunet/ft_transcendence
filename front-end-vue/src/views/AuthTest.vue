<template>
  <div class="authTest">
    <h1>Welcome</h1>
    <a href="https://api.intra.42.fr/oauth/authorize?client_id=9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06&redirect_uri=http%3A%2F%2Flocalhost%3A8080&response_type=code">
      <button>Welcome</button>
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import router from "../router";

export default Vue.extend({
  name: 'AuthTest',
  components: {
  },
  mounted: function() {
    let code = this.$route.query.code
    if (code) {
      axios.post(`http://localhost:3000/authenticate/test`, code).then(() => {
        router.push({ name: "AuthTest" });
      });
    }
  },
});

</script>
