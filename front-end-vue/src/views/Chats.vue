<template>
  <div>
    <h1>Here you can find all the chats!</h1>
    <div id="body-chat">
        <div id="list_channels">
          <div class="channel" v-for="(chat, index) in obj" :key="index" @click="select_channel(chat)">
            <span>{{ chat.name }} </span>
          </div>
        </div>
        <Chat v-if="selectedChat" :data=selectedChat />
        <div v-else class="nothing-selected">
          You can now communicate through diverse chats!
        </div>
    </div>
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
        obj: {},
        selectedChat: undefined
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
      })
      .catch(() => {
        router.push({name: 'App'});
      });

      console.log(this.selectedChat);
  },
  methods: {
    select_channel(chat: any) {
      this.selectedChat = chat;
    }
  }
});
</script>

<style scoped>

#body-chat {
  display:flex;
  flex-direction: row;
}

#list_channels{
  width:200px;
  border: 3px solid black;
}

.channel {
  width:200px;
  height:75px;
  border: 1px solid #aaa;
  color:red;
  margin:0;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
}

.channel:focus {
  background-color:red;
}

.nothing-selected {
  display:flex;
  align-items:center;
  justify-content:center;
  border: 1px solid black;
}

.selected {
  background-color: #777;
}

</style>