<template>
  <div id="body-chat">
      <div id="list_channels">
        <div class="channel" v-for="(channel, index) in channels" :key="index" @click="select_channel(channel, index)">
          <span>{{ channel.name }} </span> 
          <span>{{ channel.status }} </span>
        </div>
      </div>

      <portal-target v-if="popup_password" id="popup-password" name="popup-password">
        <div id="popup-password-content">
          <form action="" @submit.prevent="form_password_submit">
            <input type="password" placeolder="password" v-model="password_input">
            <input type="submit" value="Access">
          </form>
          <button @click="close_popup()">Close</button>
        </div>
      </portal-target>

      <template v-for="(channel, index) in channels">
        <template v-if="channel.status != 'protected' || channel.activeUserAuthorized == true">
          <Chat v-show="numberSelectedChannel != -1 && numberSelectedChannel == index" :key="index" :data="channel" />
        </template>
        <template v-else>
          <Chat v-if="numberSelectedChannel != -1 && numberSelectedChannel == index" :key="index" :data="channel" />
        </template>
      </template>

      <!--<div v-else class="nothing-selected">
        You can now communicate through diverse chats!
      </div>-->
  </div>
</template>

<script lang="ts">
/* eslint-disable */

import Vue from "vue";
import axios from "axios";
import router from "../router";
import Chat from "../components/Chat.vue"
import PortalVue from 'portal-vue'
export default Vue.extend({
  name: "Chats",
  components: {
      Chat: Chat
  },
  data() {
    return {
      keyVFor: 0,
      channels: {},
      selectedChannel: undefined,
      currentSelectedChannel: undefined,
      popup_password: false,
      password_input: undefined,
      numberSelectedChannel: -1
    };
  },
  mounted() {

      this.refresh_channels();
      /* socket io */
      this.$store.state.socket.emit("join_chats", this.$store.state.user);

      /* */ 
  },
  methods: {
    refresh_channels() {
      axios({
        method: "get",
        url: `${ process.env.VUE_APP_API_URL }/channel/index`,
        withCredentials: true
      })
        .then(res => {
          this.channels = res.data;
        })
        .catch(() => {
          router.push({name: 'App'});
        });
    },
    select_channel(channel: any, index: number) {
      this.currentSelectedChannel = channel;
      if (channel.status == 'protected' && channel.activeUserAuthorized == false)
      {
        this.popup_password = true;
        document.getElementById("nav").style.display = "none";
      }
      else
      {
        this.numberSelectedChannel = index;
        this.selectedChannel = channel;
      }
    },
    close_popup() {
      this.popup_password = false;
      document.getElementById("nav").style.display = "flex";
    },
    form_password_submit() {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/channel/authorization`,
        method: "patch",
        data: {
          channelId: this.currentSelectedChannel.id,
          password: this.password_input
        },
        withCredentials: true
      }).then(res => {
        document.getElementById("nav").style.display = "flex";
        this.password_input = undefined;
        this.selectedChannel = this.currentSelectedChannel;
        this.currentSelectedChannel = undefined;
        this.popup_password = false;
        this.refresh_channels();
      }).catch(err => {
        this.password_input = undefined;
      });
    }
  }
});
</script>

<style scoped>

/* popup password */

#popup-password {
  z-index: 1000;
  width:100vw;
  height:100vh;
  background-color:rgba(48, 74, 36, 0.6);
  position: absolute;
}

#popup-password-content {
  position:absolute;
  width:60vw;
  height:60vh;
  left: 20%;
  top: 20%;
  background-color:blue;
}

/**/

#body-chat {
  display:flex;
  height: 91vh;
  background-color:rgb(250, 99, 137);
  flex-direction: row;
}

#list_channels{
  width:200px;
  border: 3px solid black;
  background-color :white;
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
  flex-direction:column;
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
  background-color: #aaa;
}

.selected {
  background-color: #777;
}

</style>
