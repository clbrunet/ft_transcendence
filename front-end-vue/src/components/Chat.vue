<template>
  <div class="chat_and_participant">
    <div class="chat">
      <div class="title">
        <span>{{data.name}} by <span class="clickable" style="margin-right:3%;" @click="goToProfile({userId: data.ownerId})">{{data.ownerName}}</span></span>
        <button v-if="isOwner == true" @click="open_popup_settings()" class="btn-ok">add</button>
      </div>

      <template v-if="data.activeUserParticipant == true && data.activeUserBan == false && isCurrentlyBanMute(data.activeUserBanEndDateTime) == false">
        <div class="messages">
          <template v-for="(message, index) in messages">
            <p class="pbase" :key="index" v-if="message.userName != $store.state.user.name"><span style="font-weight:700;"> {{message.userName}}:</span> {{message.content}} </p>
            <p class="pyou" :key="index" v-else><span style="font-weight:700;"> {{message.content}}</span> </p>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="messages">
          <p v-if="data.activeUserParticipant == false" style="text-align:center;font-size:18px;">you are not a participant of this channel</p>
          <p v-else-if="data.activeUserBan == true || isCurrentlyBanMute(data.activeUserBanEndDateTime) == true" style="text-align:center;font-size:18px;">you were banned from this channel</p>
        </div>
      </template>

      <form
        @submit.prevent="send_message()"
        class="buttons"
        v-if="  (data.activeUserParticipant == true && data.activeUserBan == false
        && data.activeUserMute == false
        && isCurrentlyBanMute(data.activeUserBanEndDateTime) == false
        && isCurrentlyBanMute(data.activeUserMuteEndDateTime) == false)">
        <input style="text-align:center;font-size:18px;" class="message" type="text" placeholder="type your message here" v-model="messageTyping" />
        <input  style="text-align:center;font-size:18px;" class="send" type="submit" value="send" />
      </form>
      <div class="buttons" v-else>
        <template v-if="data.activeUserParticipant == false">
          <input
            style="text-align:center;font-size:18px;"
            class="message"
            type="text"
            placeholder="you are not a participant from this channel"
            disabled
          />
          <input class="send" style="text-align:center;font-size:18px;" type="submit" value="not participant" disabled />
        </template>
        <template
          v-else-if="(data.activeUserBan == true || isCurrentlyBanMute(data.activeUserBanEndDateTime) == true)"
        >
          <input
            class="message"
            type="text"
            style="text-align:center;font-size:18px;"
            placeholder="you were banned from this channel"
            disabled
          />
          <input class="send" type="submit" value="banned"  style="text-align:center;font-size:18px;" disabled />
        </template>
        <template
          v-else-if="data.activeUserMute == true || isCurrentlyBanMute(data.activeUserMuteEndDateTime) == true"
        >
          <input
            class="message"
            type="text"
            placeholder="you were muted from this channel"
            disabled
          />
          <input class="send" type="submit" value="muted" disabled />
        </template>
      </div>
    </div>

    <!-- participants -->
    <div class="partipants" v-if="(data.activeUserBan == false && isCurrentlyBanMute(data.activeUserBanEndDateTime) == false)">
      <div class="title">
        <span>Participants</span>
      </div>
      <img class="close-chat-icon"
        src="/assets/close-chat.svg"
        alt="close chat icon"
        @click="closeChat()"
      />
      <div class="scroll">
      <template v-for="(participant, index) in participants">
        <template v-if="participant.userName == $store.state.user.name">
          <div style="width:100%;" class="degrade"  :key="index">
            <span class="you" style="padding: 1% 0 1% 0;">You</span>
          </div>
        </template>
        <template v-else-if="participant.left != true">
          <div class="row-participant degrade" :key="index">
            <span class="clickable" @click="goToProfile(participant)" style="margin-right: 2%;">{{participant.userName}}</span>

            <template v-if="participant.ban == false && isCurrentlyBanMute(participant.banEndDateTime) == false">
              <button v-if="isOwner == true" @click="changeOwner(participant)" class="btn-ok">set owner</button>

              <button v-if="isOwner == true && participant.admin == false" @click="addAdmin(participant)" class="btn-ok">admin</button>
              <button v-else-if="isOwner == true" @click="removeAdmin(participant)" class="btn-ok">unadmin</button>

              <button v-if="data.activeUserAdmin == true  && participant.admin == false" @click="open_popup_ban(participant)" class="btn-ok">ban</button>
            </template>
            <button v-else @click="unbanParticipant(participant)" class="btn-ok">unban</button>
            <template v-if="data.activeUserAdmin == true&& participant.admin == false">
              <button v-if="participant.mute == false && isCurrentlyBanMute(participant.muteEndDateTime) == false" @click="open_popup_mute(participant)" class="btn-ok">mute</button>
              <button v-else @click="unmuteParticipant(participant)" class="btn-ok">unmute</button>
            </template>
          </div>
        </template>
      </template>
      </div>
    </div>
    <div class="partipants" v-else>
      <span>You were banned from this channel</span>
    </div>

    <!-- absolute -->

    <div v-if="popup_ban" class="popup-ban">
      <div class="popup-ban-content">
        <h3>Ban a participant :</h3>
        <form @submit.prevent="banParticipant()" class="form-popup-ban">
          <select v-model="selectBanTime">
            <option selected>15min</option>
            <option>30min</option>
            <option>1hour</option>
            <option>always</option>
          </select>
          <input type="submit" value="validate" />
        </form>
        <button @click="close_popup_ban()" id="popup-ban-btn">Close</button>
      </div>
    </div>

    <div v-if="popup_mute" class="popup-mute">
      <div class="popup-mute-content">
        <h3>Mute a participant :</h3>
        <form @submit.prevent="muteParticipant()" class="form-popup-mute">
          <select v-model="selectMuteTime">
            <option selected>15min</option>
            <option>30min</option>
            <option>1hour</option>
            <option>always</option>
          </select>
          <input type="submit" value="validate"/>
        </form>
        <button @click="close_popup_mute()" id="popup-mute-btn">Close</button>
      </div>
    </div>


    <div v-if="popup_settings" class="popup-settings">
      <div class="popup-settings-content">
        <div class="popup-settings-add-participant">
          <h3>Add participants :</h3>
          <div
            v-if="candidateParticipants"
            style="display:flex;flex-direction:column;color:white;"
          >
            <template v-for="(user, index) in candidateParticipants">
              <div :key="index">
                <span>{{ user.name }}</span>
                <button @click="addParticipant(user)">ajouter</button>
              </div>
            </template>
          </div>
        </div>
        <button @click="close_popup_settings()" id="popup-settings-btn">Close</button>
      </div>
    </div>
    <!-- -->
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
import router from "../router";
import store from "../store";

export default Vue.extend({
  name: "Chat",
  props: ["data"],
  data() {
    return {
      popup_settings: false as any,
      popup_mute: false as any,
      popup_ban: false as any,
      channel: undefined as any,
      participants: undefined as any,
      messages: undefined as any,
      users: undefined as any,
      isOwner: false as any,
      isAdmin: false as any,
      isParticipant: false as any,
      candidateParticipants: undefined as any,
      idData: undefined as any,
      selectBanTime: undefined as any,
      selectMuteTime: undefined as any,
      currentParticipantSelected: undefined as any,
      messageTyping: undefined as any
    };
  },
  store: store,
  watch: {
    data: function() {
      this.mounted_like();
    },
    participants: function() {
      if (this.data.ownerId == this.$store.state.user.id) {
        this.refresh_candidateParticipants();
      }
    },
    users: function() {
      if (this.data.ownerId == this.$store.state.user.id) {
        this.refresh_candidateParticipants();
      }
    },
    idData: function() {
      this.refresh_participants();
    }
  },
  mounted() {
    this.mounted_like();

    this.$store.state.socket.on('refreshOnceChat', (idRoom: any) => {
      if (idRoom == this.data.id)
      {
        this.refresh_candidateParticipants();
        this.refresh_participants();
      }
    });

    this.$store.state.socket.on('chatToClient', (message: any) => {
      this.refresh_messages();
    });
  },
  methods: {
    closeChat() {
      this.$store.dispatch('desactivateChat');
    },
    mounted_like() {
      this.refresh_participants();
      this.refresh_users();
      this.refresh_messages();
      this.refresh_channel();

      if (this.data.activeUserAdmin == true) this.isAdmin = true;
      else this.isAdmin = false;

      if (this.data.activeUserParticipant == true) this.isParticipant = true;
      else this.isParticipant = false;

      if (this.data.ownerId == this.$store.state.user.id) this.isOwner = true;
      else this.isOwner = false;
    },
    send_message() {
      if (this.messageTyping != "")
      {
        const url = `${process.env.VUE_APP_API_URL}/message/create/` + this.data.id;
        axios({
          method: "post",
          url: url,
          withCredentials: true,
          data: {
            content: this.messageTyping
          }
        }).then(() => {
          this.$store.state.socket.emit('chatToServer', {sender: this.$store.state.user.name, room:this.data.name, message: this.messageTyping});
          this.messageTyping = "";
        });
      }
    },
    refresh_participants() {
      const url = `${process.env.VUE_APP_API_URL}/channel/` + this.data.id;
      axios({
        method: "get",
        url: url,
        withCredentials: true
      }).then(res => {
        this.participants = res.data.participants;
      });
    },
    refresh_channel() {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_API_URL}/channel/` + this.data.id,
        withCredentials: true
      }).then(res => {
        const url = `${process.env.VUE_APP_API_URL}/participant/isParticipant/` + this.data.id;
        axios({
          method: "get",
          url: url,
          withCredentials: true
        }).then(() => {
          this.isParticipant = true;
        }).catch(() => {
          this.isParticipant = false;
        });
        this.idData = res.data;
        if (this.idData.activeUserAdmin == true) this.isAdmin = true;
        else this.isAdmin = false;

        if (this.idData.ownerId == this.$store.state.user.id) this.isOwner = true;
        else this.isOwner = false;
      });
    },
    refresh_users() {
      const url = `${process.env.VUE_APP_API_URL}/user/index`;
      axios({
        method: "get",
        url: url,
        withCredentials: true
      }).then(res => {
        this.users = res.data;
      });
    },
    refresh_messages() {
      const url = `${process.env.VUE_APP_API_URL}/message/all/` + this.data.id;
      axios({
        method: "get",
        url: url,
        withCredentials: true
      }).then(res => {
        this.messages = res.data.reverse();
      }).catch(() => {
        console.log("No permission so see some of messages");
      });
    },
    changeOwner(participant: any) {
      const url =
        `${process.env.VUE_APP_API_URL}/channel/changeOwner/` + this.data.id;
      axios({
        method: "patch",
        url: url,
        withCredentials: true,
        data: {
          ownerId: participant.userId
        }
      }).then(() => {
        this.refresh_channel();
        this.$store.state.socket.emit('refreshChannels', this.data.id);
        this.refresh_participants();
      }).catch(() => {
        alert("please refresh")
      });
    },
    addAdmin(participant: any) {
      const url = `${process.env.VUE_APP_API_URL}/channel/admin/true`;
      axios({
        method: "post",
        url: url,
        withCredentials: true,
        data: {
          userId: participant.userId,
          channelId: this.data.id
        }
      }).then(() => {
        this.$store.state.socket.emit('refreshChannels', this.data.id);
        this.refresh_participants();
      });
    },
    removeAdmin(participant: any) {
      const url = `${process.env.VUE_APP_API_URL}/channel/admin/false`;
      axios({
        method: "post",
        url: url,
        withCredentials: true,
        data: {
          userId: participant.userId,
          channelId: this.data.id
        }
      }).then(() => {
        this.$store.state.socket.emit('refreshChannels', this.data.id);
        this.refresh_participants();
      });
    },
    addParticipant(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/channel/addParticipant`;
      axios({
        method: "post",
        url: url,
        withCredentials: true,
        data: {
          userId: user.id,
          channelId: this.data.id
        }
      }).then(() => {
        this.$store.state.socket.emit('refreshChannels');
        this.refresh_participants();
      });
    },
    close_popup_settings() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "flex") : 0;
      const list_channels = document.getElementById("revamp2");
      list_channels ? (list_channels.style.display = "") : 0;
      
      const global = document.getElementById("current-chat");
      global ? (global.style.width = "") : 0;

      this.popup_settings = false;
    },
    close_popup_ban() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "flex") : 0;
      const list_channels = document.getElementById("revamp2");
      list_channels ? (list_channels.style.display = "") : 0;

      const global = document.getElementById("current-chat");
      global ? (global.style.width = "") : 0;
      
      this.popup_ban = false;
    },
    close_popup_mute() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "flex") : 0;
      const list_channels = document.getElementById("revamp2");
      list_channels ? (list_channels.style.display = "") : 0;

      const global = document.getElementById("current-chat");
      global ? (global.style.width = "") : 0;
      this.popup_mute = false;
    },
    open_popup_settings() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "none") : 0;
      const list_channels = document.getElementById("revamp2");
      list_channels ? (list_channels.style.display = "none") : 0;

      const global = document.getElementById("current-chat");
      global ? (global.style.width = "100%") : 0;
      this.popup_settings = true;
    },
    open_popup_ban(participant: any) {
      this.currentParticipantSelected = participant;
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "none") : 0;
      const list_channels = document.getElementById("revamp2");
      list_channels ? (list_channels.style.display = "none") : 0;

      const global = document.getElementById("current-chat");
      global ? (global.style.width = "100%") : 0;
      this.popup_ban = true;
    },
    open_popup_mute(participant: any) {
      this.currentParticipantSelected = participant;
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "none") : 0;
      const list_channels = document.getElementById("revamp2");
      list_channels ? (list_channels.style.display = "none") : 0;

      const global = document.getElementById("current-chat");
      global ? (global.style.width = "100%") : 0;
      this.popup_mute = true;
    },
    refresh_candidateParticipants() {
      const url =
        `${process.env.VUE_APP_API_URL}/channel/participantCandidate/` +
        this.data.id;
      axios({
        method: "get",
        url: url,
        withCredentials: true
      })
      .then(res => {
        this.candidateParticipants = res.data;
      })
      .catch(() => {
        console.log("");
      });
    },
    isCurrentlyBanMute(timestamp: any) {
      let current = new Date();
      let compare = new Date(timestamp);

      if (compare <= current) return false;
      return true;
    },
    unbanParticipant(participant: any) {
      axios({
        method: "post",
        url: `${process.env.VUE_APP_API_URL}/channel/ban`,
        withCredentials: true,
        data: {
          userId: participant.userId,
          channelId: this.data.id,
          always: false,
          minutes: 0
        }
      }).then(() => {
        this.refresh_participants();
        this.refresh_channel();
        this.$store.state.socket.emit('refreshChannels', this.data.id);
      });
    },
    banParticipant(participant: any) {
      let banTime;

      if (this.selectBanTime == '15min') {
        banTime = 15;
      }
      else if (this.selectBanTime == '30min') {
        banTime = 30;
      }
      else if (this.selectBanTime == '1hour') {
        banTime = 60;
      }
      axios({
        method: "post",
        url: `${process.env.VUE_APP_API_URL}/channel/ban`,
        withCredentials: true,
        data: {
          userId: this.currentParticipantSelected.userId,
          channelId: this.data.id,
          always: this.selectBanTime == 'always' ? true : false,
          minutes: banTime
        }
      }).then(() => {
        this.close_popup_ban();
        this.currentParticipantSelected = undefined;
        this.selectBanTime = undefined;
        this.refresh_participants();
        this.refresh_channel();
        this.$store.state.socket.emit('refreshChannels', this.data.id);
      });
    },
    muteParticipant(participant: any) {
      let muteTime;

      if (this.selectMuteTime == '15min') {
        muteTime = 15;
      }
      else if (this.selectMuteTime == '30min') {
        muteTime = 30;
      }
      else if (this.selectMuteTime == '1hour') {
        muteTime = 60;
      }
      axios({
        method: "post",
        url: `${process.env.VUE_APP_API_URL}/channel/mute`,
        withCredentials: true,
        data: {
          userId: this.currentParticipantSelected.userId,
          channelId: this.data.id,
          always: this.selectMuteTime == 'always' ? true : false,
          minutes: muteTime
        }
      }).then(() => {
        this.close_popup_mute();
        this.currentParticipantSelected = undefined;
        this.selectMuteTime = undefined;
        this.refresh_participants();
        this.refresh_channel();
        this.$store.state.socket.emit('refreshChannels', this.data.id);
      });
    },
    unmuteParticipant(participant: any) {
      axios({
        method: "post",
        url: `${process.env.VUE_APP_API_URL}/channel/mute`,
        withCredentials: true,
        data: {
          userId: participant.userId,
          channelId: this.data.id,
          always: false,
          minutes: 0
        }
      }).then(() => {
        this.refresh_participants();
        this.refresh_channel();
        this.$store.state.socket.emit('refreshChannels', this.data.id);
      });
    },
    goToProfile(user: any) {
      const path = "/profile/" + user.userId;
      router.push({ path: path });
    }
  }
});
</script>

<style scoped>
.chat_and_participant {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 91vh;
  position: relative;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}


.messages {
  overflow-y: auto;
  display:flex;
  flex-direction:column-reverse;
  height:100%;

}

#form-create-channel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat {
  display: flex;
  border: 2px solid black;
  width: 70%;
  flex-direction: column;
  background-color:rgb(250, 99, 137);
}

.title {
  color: white;
  font-weight:700;
  background-color: #3040F0;
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 2px solid black;
}

.title span {
  white-space: nowrap;
}

.you {
  color:black;
  font-style: italic;
  font-weight: 700;
  text-align:center;
}

.buttons {
  display: flex;
  width: 100%;
  height: 10%;
}

.popup-mute {
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  position: absolute;
  margin: 0;
}

.form-popup-mute {
  display:flex;
  width:80%;
  background-color:white;
  flex-direction: column;
  align-items:center;
  justify-content: space-around;
}

.form-popup-mute input{
  margin:5%;
  width:40%;
  padding:2%;

}

.form-popup-mute select {
    margin:5%;
  width:40%;
  padding:2%;

}

.btn-ok {
  background-color: #3040F0;
  outline:none;
  border: 1px solid white;
  border-radius: 5px;
  cursor:pointer;
  color:white;
}

.btn-ok:hover {
  background-color: rgb(21, 39, 235);
}


.popup-mute-content {
  position: absolute;
  width: 40vw;
  height: 60vh;
  left: 20%;
  top: 20%;
  background-color: white;
  border-radius:25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

#popup-mute-btn {
  width: 25%;
  cursor: pointer;
  padding: 2%;
}

.popup-ban {
  z-index: 6000;
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.form-popup-ban {
  display:flex;
  width:80%;
  background-color:white;
  flex-direction: column;
  align-items:center;
  justify-content: space-around;
}

.scroll {
  height: 100%;
  overflow-y: auto;
}

.form-popup-ban input {
  margin:5%;
  width:40%;
  padding:2%;
}

.form-popup-ban select {
    margin:5%;
  width:40%;
  padding:2%;
}

.popup-ban-content {
  position: absolute;
  background-color:white;
  width: 40vw;
  border-radius:25px;
  height: 60vh;
  left: 20%;
  top: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

#popup-ban-btn {
  width: 25%;
  cursor: pointer;
  padding: 2%;
}

.popup-settings {
  z-index: 1000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top:0;
  left:0;
  background-color: rgba(0, 0, 0, 0.85);
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-settings-content {
  width: 50%;
  height: 60%;
  background-color: white;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

#popup-settings-btn {
  width: 25%;
  cursor: pointer;
  padding: 2%;
}

.popup-settings-add-participant button {
  cursor:pointer;
  padding: 2%;
  outline: none;
  color:white;
  border-radius: 8px;
  background-color:#3040F0;
  border: 1px solid white;
  width:20%;
}

.popup-settings-add-participant button:hover {
  background-color:rgb(28, 46, 247);
}

.popup-settings-add-participant {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80%;
  background-color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-y: auto;
  align-items:center;
}

.popup-settings-add-participant span {
  color: black;
  margin: 0 2% 0 2%;
  width: 20%;
}

.popup-settings-add-participant div {
  width :90%;
  display:flex;
  align-items:center;
  justify-content: space-around;
}

/* incoming

.popup-settings-add-participant {

}

.popup-settings-change-status {

}*/

.row-participant {
  background-color: white;
  width: 100%;
  color:black;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1% 0 1% 0;
}

.row-participant span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p {
  padding: 1% 0 1% 0;
  color:black;
  margin:0;
}

p:nth-child(even) {
  background-color:rgb(250, 99, 137);
}

p:nth-child(odd) {
  background-color:rgb(245, 62, 108);
}

.pbase {
  text-align:left;
  padding-left:2%;
  word-break: break-all;
}

.pyou {
  text-align:right;
  padding-right:2%;
  word-break: break-all;
}

.message {
  flex: 3;
}

.message:disabled {
  cursor:not-allowed;
}

.send {
  flex: 1;
  background-color:#3040F0;
  color:white;
  outline:none;
  font-weight: 700;
  border: 1px solid white;
  cursor:pointer;
}

.send:disabled {
  background-color:rgb(132, 141, 241);
}

.send:disabled:hover {
  background-color:rgb(132, 141, 241);
  cursor:not-allowed;
}

.send:hover {
  background-color:rgb(29, 47, 245);
}

.partipants {
  width: 30%;
  /*background-color: rgb(68, 96, 253);*/
  background-color:white;
  display: flex;
  flex-direction: column;
  border-top: 2px solid black;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
}

.close-chat-icon {
  display: none;
}

.degrade:nth-child(even) {
  background-color:#ededed;
}

@media (max-width: 770px) {
  .chat_and_participant {
    width: 100%;
  }

  .chat {
    width: 70%;
  }

  .message {
    width: 75%;
  }

  .send {
    width: 25%;
  }

  .close-chat-icon {
    display: block;
    justify-self: center;
    align-self: center;
    cursor: pointer;
    width: 40px;
    margin: 5px;
  }

  .popup-settings-content {
    width: 80%;
  }

  .partipants {
    border: none;
  }
}

</style>
