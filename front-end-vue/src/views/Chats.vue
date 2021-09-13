<template>
  <div id="body-chat">
      <div id="list_channels">
        <button @click="open_popup_create()">+</button> 
        <div class="channel" v-for="(channel, index) in channels" :key="index" @click="select_channel(channel, index)">
          <span>{{ channel.name }} </span> 
          <span>{{ channel.status }} </span>
        </div>
      </div>
      <template v-for="(channel, index) in channels">
        <template v-if="channel.status != 'protected' || channel.activeUserAuthorized == true">
          <Chat v-show="numberSelectedChannel == index" :key="index" :data="channel" />
        </template>
        <template v-else>
          <Chat v-if="numberSelectedChannel == index" :key="index" :data="channel" />
        </template>
      </template>

      <!-- popups -->
      <portal-target v-if="popup_password" id="popup-password" name="popup-password">
        <div id="popup-password-content">
          <form action="" @submit.prevent="form_password_submit">
            <input type="password" placeolder="password" v-model="password_input">
            <input type="submit" value="Access">
          </form>
          <button @click="close_popup_password()">Close</button>
        </div>
      </portal-target>

      <div v-if="popup_create" id="popup-create">
        <div id="popup-create-content">
          <form @submit.prevent="create_channel()" id="form-create-channel">
            <input type="text" v-model="createName">
            <select v-model="createStatus">
              <option disabled value="">select one</option>
              <option>public</option>
              <option>private</option>
              <option>protected</option>
            </select>
            <input v-if="createStatus == 'protected'" type="password" v-model="createPassword">
            <input type="submit">
          </form>
          <p class="error">{{errorCreate}}</p>
          <button @click="close_popup_create()">Close</button>
        </div>
      </div>
      <!--  -->
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
      errorCreate: undefined as any,
      channels: {} as any ,
      selectedChannel: undefined as any,
      currentSelectedChannel: undefined as any,
      popup_password: false as any,
      popup_create: false as any,
      password_input: undefined as any,
      numberSelectedChannel: 0,
      createName: undefined as any,
      createPassword: undefined as any,
      createStatus: undefined as any
    };
  },
  mounted() {

      this.refresh_channels();
      /* socket io */
      //this.$store.state.socket.emit("join_chats", this.$store.state.user);

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
        const nav = document.getElementById("nav");
        nav ? nav.style.display = "none" : 0 ;
      }
      else
      {
        this.numberSelectedChannel = index;
        this.selectedChannel = channel;
      }
    },
    close_popup_password() {
      this.popup_password = false;
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "flex" : 0 ;
    },
    form_password_submit() {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/channel/authorization`,
        method: "patch",
        data: {
          channelId: (this.currentSelectedChannel as any).id,
          password: this.password_input
        },
        withCredentials: true
      }).then(res => {
        const nav = document.getElementById("nav");
        nav ? nav.style.display = "flex" : 0 ;
        this.password_input = undefined;
        this.selectedChannel = this.currentSelectedChannel;
        this.currentSelectedChannel = undefined;
        this.popup_password = false;
        this.refresh_channels();
      }).catch(err => {
        this.password_input = undefined;
      });
    },
    open_popup_create() {
      this.popup_create = true;
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "none" : 0 ;
    },
    close_popup_create() {
      this.popup_create = false;
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "flex" : 0 ;
    },
    create_channel() {
      if (this.createStatus == 'public')
        this.createStatus = 0;
      if (this.createStatus == 'private')
        this.createStatus = 1;
      if (this.createStatus == 'protected')
        this.createStatus = 2;

      axios({
        method: "post",
        url: `${ process.env.VUE_APP_API_URL }/channel/create`,
        withCredentials: true,
        data: {
          name: this.createName,
          status: this.createStatus,
          password: this.createPassword
        }
      })
      .then(res => {
        this.close_popup_create();
        this.refresh_channels();
      }).catch(err => {
        //console.log(err);
        this.errorCreate = Array.isArray(err.message) ? [err.message] : err.message;
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

#popup-create {
  z-index: 1000;
  width:100vw;
  height:100vh;
  background-color:rgba(48, 74, 36, 0.6);
  position: absolute;
}

#popup-create-content {
  position:absolute;
  width:60vw;
  height:60vh;
  left: 20%;
  top: 20%;
  background-color:blue;
}

/**/

#form-create-channel {
  display:flex;
  flex-direction: column;
  align-items:center;
}

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
  max-height: 50%;
  overflow-y: auto; /* maybe remove */
  overflow-x: hidden;
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

.error {
  color: red;
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
