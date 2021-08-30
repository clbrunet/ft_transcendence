<template>
  <div class="home">
    <p>Si tu es connecté, un Hello World devrait apparaître, ou sinon ... bye bye</p>
    <button @click="HelloWorld">Tester !</button>
    <p v-if="HelloWorldText != ''">{{ HelloWorldText }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "Home",
  components: {},
  data() {
    return {
      HelloWorldText: ""
    };
  },
  methods: {
    HelloWorld() {
      axios({
        method: "get",
        url: "http://localhost:3000",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000"
        },
        withCredentials: true
      })
      .then(res => {
          if (res.status == 200) this.HelloWorldText = res.data;
      })
      .catch(() => {
          this.HelloWorldText = "Bye bye...";
      });
    }
  }
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

#nav {
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: space-between;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 15px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>