<template>
    <div>
        <h1>Here you can find all the chats!</h1>
        <Chat v-for="(chat, index) in obj" :key="index" :dataChat=chat />
    </div>

</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import router from "../router";
import Chat from "../components/Chat.vue"
export default Vue.extend({
  name: "Chats",
  components: {
      Chat: Chat
  },
  data() {
    return {
        obj: {}
    };
  },
  mounted() {
    axios({
      method: "get",
      url: "http://localhost:3000/channel/all",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000"
      },
      withCredentials: true
    })
      .then(res => {
        this.obj = res.data;
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        router.push({name: 'App'});
      });
  }
});
</script>