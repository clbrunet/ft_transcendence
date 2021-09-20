<template>
  <div id="body-chat">
    <div id="revamp">
      <div id="revamp2">
        <div class="creating">
          <span>Add a channel </span>
          <img
            src="/assets/add.svg"
            alt="add"
            style="width:30px;cursor:pointer;"
             @click="open_popup_create()"
          />
        </div>
        <div class="list_channels" v-bind:class="{ 'list_channels--inactive': isChatActive }">
          <span style="font-weight:700;font-size:23px;text-decoration:underline;">channels general</span>
          <div class="channel" v-for="(channel, index) in channels" :key="index" @click="select_channel(channel, index)">
            <span>{{ channel.name }} </span> 
            <span>{{ channel.status }} </span>
            <div class="buttons-channels">
              <img
                v-if="channel.activeUserParticipant == true && channel.activeUserAuthorized == true"
                src="/assets/leave.svg"
                alt="leave"
                style="width:30px;cursor:pointer;"
                @click.stop="leave_channel(channel)"
              />
              <img
                v-if="channel.ownerId == $store.state.user.id"
                src="/assets/settings.svg"
                alt="settings"
                style="width:30px;cursor:pointer;"
                @click.stop="open_params()"
              />
            </div>
          </div>
          <span style="font-weight:700;font-size:23px;text-decoration:underline;">direct messages</span>
          <div class="channel" v-for="(conv, indexdm) in dm" :key="(indexdm + 12) * 12" @click="select_dm(conv, indexdm)">
            <span>{{ conv.name }} </span> 
          </div>
        </div>
      </div>
      <div class="current-chat" v-bind:class="{ 'current-chat--active': isChatActive }">
        <template v-for="(channel, index) in channels">
          <template v-if="(channel.status != 'protected' || channel.activeUserAuthorized == true) && showDm == false">
            <Chat v-show="numberSelectedChannel == index" :key="index" :data="channel" />
          </template>
          <template v-else-if="showDm == false">
            <Chat v-if="numberSelectedChannel == index" :key="index" :data="channel" />
          </template>
        </template>
        <template v-for="(conv, indexdm) in dm">
          <DirectMessage v-if="showDm == true && numberSelectedDm == indexdm" :key="indexdm" :data="conv" />
        </template>
      </div>
    </div>
    <!-- popups -->
    <portal-target v-if="popup_password" id="popup-password" name="popup-password">
      <div id="popup-password-content">
        <form action="" @submit.prevent="form_password_submit">
          <input type="password" required placeolder="password" v-model="password_input">
          <input type="submit" value="Access">
        </form>
        <button @click="close_popup_password()">Close</button>
      </div>
    </portal-target>

    <div v-if="popup_create" id="popup-create">
      <div id="popup-create-content">
        <form @submit.prevent="create_channel()" id="form-create-channel">
          <input type="text" required v-model="createName">
          <select required v-model="createStatus">
            <option selected>public</option>
            <option>private</option>
            <option>protected</option>
          </select>
          <input v-if="createStatus == 'protected'" required type="password" v-model="createPassword">
          <input type="submit">
        </form>
        <p class="error">{{errorCreate}}</p>
        <button @click="close_popup_create()">Close</button>
      </div>
    </div>

    <div class="popup-params" v-if="params">
      <div class="popup-params-content">
        <h3>Change status :</h3>
        <form @submit.prevent="change_status()" id="form-create-channel">
          <select required v-model="changeStatus">
            <option>public</option>
            <option>private</option>
            <option>protected</option>
          </select>
          <input v-if="changeStatus == 'protected'" type="password" v-model="changePassword" />
          <input type="submit" />
        </form>
        <button @click="close_params()">Close</button>
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
import DirectMessage from "../components/DirectMessage.vue"
import PortalVue from 'portal-vue'
import store from "../store"

export default Vue.extend({
  name: "Chats",
  components: {
    Chat: Chat,
    DirectMessage: DirectMessage
  },
  data() {
    return {
      keyVFor: 0,
      errorCreate: undefined as any,
      channels: {} as any,
      dm: undefined as any,
      selectedChannel: undefined as any,
      currentSelectedChannel: undefined as any,
      numberSelectedDm: 0 as any,
      currentNumberSelectedChannel: 0 as any,
      popup_password: false as any,
      popup_create: false as any,
      password_input: undefined as any,
      numberSelectedChannel: 0,
      createName: undefined as any,
      createPassword: undefined as any,
      createStatus: undefined as any,
      changeStatus: undefined as any,
      changePassword: undefined as any,
      params: false as any,
      showDm: false as any,
      flag: false as any
    };
  },
  store: store,
  computed: {
    isChatActive() {
      return store.state.isChatActive;
    },
  },
  mounted() {
    this.$store.dispatch('desactivateChat');
    this.refresh_channels();
    this.refresh_dm();

    this.$store.state.socket.on('refreshChannels', (id: any) => {
      if (this.$store.state.user.id == id)
      {
        this.refresh_dm();
      }
    });
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
        if (this.flag == false)
        {
          this.flag = true;
          this.select_channel(this.channels[0], 0);
        }
      })
      .catch(() => {
        router.push({name: 'App'});
      });
    },
    refresh_dm() {
      axios({
        method: "get",
        url: `${ process.env.VUE_APP_API_URL }/direct/index`,
        withCredentials: true
      })
      .then(res => {
        this.dm = res.data;
        if (this.$store.state.goDM != undefined)
        {
          this.showDm = true;
          for (let i = 0; i < this.dm.length ; i++)
          {
            if (this.dm[i].id == this.$store.state.goDM.id)
            this.select_dm(this.dm[i], i);
          }
          this.$store.state.goDM = undefined;
        }
      })
      .catch(() => {
        console.log("");
        router.push({name: 'App'});
      });
    },
    select_channel(channel: any, index: number) {
      this.currentSelectedChannel = channel;
      this.currentNumberSelectedChannel = index;
      if (channel.status == 'protected' && channel.activeUserAuthorized == false)
      {
        this.popup_password = true;
        const nav = document.getElementById("nav");
        nav ? nav.style.display = "none" : 0 ;
        this.refresh_channels();
        return;
      }
      this.showDm = false;
      this.numberSelectedChannel = index;
      this.selectedChannel = channel;
      this.$store.state.socket.emit('joinRoom', this.selectedChannel.name);
      this.refresh_channels();
      this.$store.dispatch('activateChat');
    },
    select_dm(channel: any, index: number) {
      this.showDm = true;
      this.numberSelectedDm = index;
      this.selectedChannel = channel;
      this.$store.state.socket.emit('joinRoom', this.selectedChannel.id);
      this.refresh_channels();
      this.$store.dispatch('activateChat');
    },
    open_params() {
      this.params = true;
    },
    close_params() {
      this.params = false;
    },
    close_popup_password() {
      this.password_input = "";
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
        this.numberSelectedChannel = this.currentNumberSelectedChannel;
        this.currentSelectedChannel = undefined;
        this.currentNumberSelectedChannel = undefined;
        this.popup_password = false;
        this.refresh_channels();
      }).catch(err => {
        this.password_input = undefined;
        alert('wrong password');
      });
    },
    open_popup_create() {
      this.popup_create = true;
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "none" : 0 ;
    },
    close_popup_create() {
      this.createName = "";
      this.errorCreate = "";
      this.createPassword = "";
      this.popup_create = false;
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "flex" : 0 ;
    },
    create_channel() {
      this.errorCreate = "";
      console.log(this.createStatus);
      if (this.createStatus == 'public') {
        this.createPassword = undefined;
        this.createStatus = 0;
      }
      else if (this.createStatus == 'private') {
        this.createPassword = undefined;
        this.createStatus = 1;
      }
      else if (this.createStatus == 'protected') {
        this.createStatus = 2;
      }

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
      .then(() => {
        this.close_popup_create();
        this.refresh_channels();
      }).catch(err => {
        this.errorCreate = Array.isArray(err.response.data.message) ? [err.response.data.message] : err.response.data.message;
      });
    },
    change_status() {
      let statusEnum;

      if (this.changeStatus == "public") {
        this.changePassword = undefined;
        statusEnum = 0;
      }
      else if (this.changeStatus == "private") {
        this.changePassword = undefined;
        statusEnum = 1;
      }
      else if (this.changeStatus == "protected") {
        statusEnum = 2;
      }

      if (this.changePassword == undefined)
      this.changePassword = "passwordRandom";
      const url =
        `${process.env.VUE_APP_API_URL}/channel/changeStatus/` + this.selectedChannel.id;

      axios({
        method: "patch",
        url: url,
        withCredentials: true,
        data: {
          status: statusEnum,
          password: this.changePassword
        }
      })
      .then(() => {
        this.changeStatus = undefined;
        this.changePassword = undefined;
        this.refresh_channels();
        this.close_params();
      })
      .catch(err => {
        console.log("");
      });
    },
    leave_channel(channel: any) {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/channel/leave/` + channel.id,
        method: "patch",
        withCredentials: true
      }).then(res => {
        this.refresh_channels();
      }).catch(() => {
        alert("you can't leave as owner");
      })
    }
  }
});
</script>

<style scoped>

/* popup password */

#revamp {
  display:flex;
  flex-direction: row;
  width:100%;
}

.buttons-channels {
  display:flex;

}

  .buttonAdd {
    cursor:pointer;
    width:30%;
  }

#revamp2 {
  display: flex;
  flex-direction: column;
  width:20%;
}

.creating {
  display:flex;
  flex-direction: column;
  align-items:center;
  background-color:white;
}

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
  width: 100%;
  height: 91vh;
  background-color:rgb(250, 99, 137);
  flex-direction: row;
}

.list_channels{
  width: 100%;
  border: 3px solid black;
  background-color :white;
  max-height: 100%;
  overflow-y: auto; /* maybe remove */
  overflow-x: hidden;
}

.channel {
  width: 100%;
  min-height: 50px;
  height: auto;
  padding:2%;
  border: 1px solid #aaa;
  color:white;
  background-color:#3040F0;
  margin:0;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  cursor:pointer;
  word-break: break-all;
}

.channel:nth-child(even) {
  background-color:rgb(68, 96, 253);
}

.channel:focus {
  background-color:red;
}

.popup-params {
  z-index: 1000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top:0;
  left:0;
  background-color: rgba(48, 74, 36, 0.6);
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-params-content {
  width: 50%;
  height: 60%;
  background-color: blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
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

.current-chat {
  width: 70%;
}



@media (max-width: 770px) {
  .list_channels {
    width: 100%;
  }

  .list_channels--inactive {
    flex-direction: row;
    display: none;
  }

  .channel {
    width: 100%;
    min-height: 50px;
  }


  .current-chat {
    display: none;
  }

  .current-chat--active {
    width: 100%;
    display: flex;
  }

  .popup-params-content {
    width: 80%;
  }
}

</style>
