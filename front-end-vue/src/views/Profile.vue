<template>
  <div class="profile">
    <h1>This is the profile page</h1>
    <div id="user">
      <span> {{name}}</span>
      <span v-if="email"> email : {{email}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from '../store';
import axios from 'axios';
import router from '../router';
export default Vue.extend({
  name: 'Profile',
  store: Store,
  data() {
    return {
      name: "",
      email: ""
    }
  },
  mounted() {
    axios({
      method: "get",
      url: "http://localhost:3000/authentication",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000"
      },
      withCredentials: true
    })
      .then(res => {
        this.$store.state.user = res.data;
        this.$store.dispatch("authenticate");

        if (this.$store.state.is_auth)
        {
          this.name = this.$store.state.user.name;
          this.email = this.$store.state.user.email;
        }
      })
      .catch(() => {
        this.$store.dispatch("unauthenticate");
        router.push({ name: "App" });
      });
  }

})
</script>