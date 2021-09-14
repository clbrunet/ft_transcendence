<template>
  <div class="chat_and_participant">
    <div class="chat">
      <div class="title">
        <span>{{data.name}} by {{data.ownerName}}</span>
        <button v-if="isOwner == true" @click="open_popup_settings()">add</button>
      </div>

      <template v-if="data.status == 'public' || (isParticipant == true && data.activeUserBan == false && isCurrentlyBanMute(data.activeUserBanEndDateTime) == false)">
        <div class="messages">
          <p
            v-for="(message, index) in messages"
            :key="index"
          >{{message.userName}}: {{message.content}}</p>
        </div>
      </template>
      <template v-else>
        <div class="messages">
          <p v-if="isParticipant == false">you are not a participant of this channel</p>
          <p v-else-if="data.activeUserBan == true || isCurrentlyBanMute(data.activeUserBanEndDateTime) == true">you were banned from this channel</p>
        </div>
      </template>

      <form
        @submit.prevent="send_message()"
        class="buttons"
        v-if="(data.status == 'public' && isParticipant == true) ||  
              (isParticipant == true && data.activeUserBan == false
              && data.activeUserMute == false
              && isCurrentlyBanMute(data.activeUserBanEndDateTime) == false
              && isCurrentlyBanMute(data.activeUserMuteEndDateTime) == false)">
        <input class="message" type="text" placeholder="type your message here" v-model="messageTyping" />
        <input class="send" type="submit" value="send" />
      </form>
      <div class="buttons" v-else>
        <template v-if="isParticipant == false">
          <input
            class="message"
            type="text"
            placeholder="you are not a participant from this channel"
            disabled
          />
          <input class="send" type="submit" value="not participant" disabled />
        </template>
        <template
          v-else-if="(data.activeUserBan == true || isCurrentlyBanMute(data.activeUserBanEndDateTime) == true) && data.status != 'public'"
        >
          <input
            class="message"
            type="text"
            placeholder="you were banned from this channel"
            disabled
          />
          <input class="send" type="submit" value="banned" disabled />
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
    <div class="partipants" v-if="data.status == 'public' || (data.activeUserBan == false && isCurrentlyBanMute(data.activeUserBanEndDateTime) == false)">
      <template v-for="(participant, index) in participants">
        <template v-if="participant.userName == $store.state.user.name">
          <span :key="index" class="you">You</span>
        </template>
        <template v-else-if="participant.left != true">
          <div class="row-participant" :key="index">
            <span class="clickable" @click="goToProfile(participant)">{{participant.userName}}</span>

            <template v-if="participant.ban == false && isCurrentlyBanMute(participant.banEndDateTime) == false">
              <button v-if="isOwner == true" @click="changeOwner(participant)">change owner</button>
              
              <button v-if="isOwner == true && participant.admin == false" @click="addAdmin(participant)">+ admin</button>
              <button v-else-if="isOwner == true" @click="removeAdmin(participant)">- admin</button>
             
              <button v-if="data.activeUserAdmin == true  && participant.admin == false && data.status != 'public'" @click="open_popup_ban(participant)">Ban</button>
            </template>
            <button v-else @click="unbanParticipant(participant)">unban</button>
            <template v-if="data.activeUserAdmin == true&& participant.admin == false && data.status != 'public'">
              <button v-if="participant.mute == false && isCurrentlyBanMute(participant.muteEndDateTime) == false" @click="open_popup_mute(participant)">Mute</button>
              <button v-else @click="unmuteParticipant(participant)">unmute</button>
            </template>
          </div>
        </template>
      </template>
    </div>
    <div class="partipants" v-else>
      <span>You were banned from this channel</span>
    </div>

    <!-- absolute -->

    <div v-if="popup_mute" class="popup-mute">
      <div class="popup-mute-content">
        <h3>mute :</h3>
        <form @submit.prevent="muteParticipant()" class="form-popup-mute">
          <select v-model="selectMuteTime">
            <option selected>15min</option>
            <option>30min</option>
            <option>1hour</option>
            <option>always</option>
          </select>
          <input type="submit" />
        </form>
        <button @click="close_popup_mute()" id="popup-mute-btn">Close</button>
      </div>
    </div>

    <div v-if="popup_ban" class="popup-ban">
      <div class="popup-ban-content">
        <h3>Ban :</h3>
        <form @submit.prevent="banParticipant()" class="form-popup-ban">
          <select v-model="selectBanTime">
            <option selected>15min</option>
            <option>30min</option>
            <option>1hour</option>
            <option>always</option>
          </select>
          <input type="submit" />
        </form>
        <button @click="close_popup_ban()" id="popup-ban-btn">Close</button>
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
  watch: {
    data: function() {
      this.mounted_like();
    },
    participants: function() {
      if (this.data.ownerId == this.$store.state.user.id)
        this.refresh_candidateParticipants();
    },
    users: function() {
      if (this.data.ownerId == this.$store.state.user.id)
        this.refresh_candidateParticipants();
    },
    idData: function() {
      this.refresh_participants();
    }
  },
  mounted() {
    this.mounted_like();

    this.$store.state.socket.on('chatToClient', (message: any) => {
      this.refresh_messages();
    });
  },
  methods: {
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
        this.refresh_participants();
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
        this.refresh_participants();
      });
    },
    close_popup_settings() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "flex") : 0;
      const list_channels = document.getElementById("list_channels");
      list_channels ? (list_channels.style.display = "block") : 0;
      this.popup_settings = false;
    },
    close_popup_ban() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "flex") : 0;
      const list_channels = document.getElementById("list_channels");
      list_channels ? (list_channels.style.display = "block") : 0;
      this.popup_ban = false;
    },
    close_popup_mute() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "flex") : 0;
      const list_channels = document.getElementById("list_channels");
      list_channels ? (list_channels.style.display = "block") : 0;
      this.popup_mute = false;
    },
    open_popup_settings() {
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "none") : 0;
      const list_channels = document.getElementById("list_channels");
      list_channels ? (list_channels.style.display = "none") : 0;
      this.popup_settings = true;
    },
    open_popup_ban(participant: any) {
      this.currentParticipantSelected = participant;
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "none") : 0;
      const list_channels = document.getElementById("list_channels");
      list_channels ? (list_channels.style.display = "none") : 0;
      this.popup_ban = true;
    },
    open_popup_mute(participant: any) {
      this.currentParticipantSelected = participant;
      const nav = document.getElementById("nav");
      nav ? (nav.style.display = "none") : 0;
      const list_channels = document.getElementById("list_channels");
      list_channels ? (list_channels.style.display = "none") : 0;
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
      });
    },
    banParticipant(participant: any) {
      let banTime;

      if (this.selectBanTime == '15min')
        banTime = 15;
      else if (this.selectBanTime == '30min')
        banTime = 30;
      else if (this.selectBanTime == '1hour')
        banTime = 60;
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
      });
    },
    muteParticipant(participant: any) {
      let muteTime;

      if (this.selectMuteTime == '15min')
        muteTime = 15;
      else if (this.selectMuteTime == '30min')
        muteTime = 30;
      else if (this.selectMuteTime == '1hour')
        muteTime = 60;
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
  height:80%;

}

#form-create-channel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat {
  display: flex;
  border: 1px solid black;
  width: 60%;
  flex-direction: column;
  position: relative;
  background-color: #aaa;
}

.title {
  color: white;
  background-color: black;
  padding: 15px;
}

.you {
  font-style: italic;
}

.buttons {
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10%;
}

.popup-mute {
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(48, 74, 36, 0.6);
  position: absolute;
  margin: 0;
}

.form-popup-mute {
  display:flex;
  width:80%;
  background-color:yellow;
  flex-direction: column;
  align-items:center;
  justify-content: space-around;
}

.form-popup-mute input {
  width:40%;
}

.popup-mute-content {
  position: absolute;
  width: 40vw;
  height: 60vh;
  left: 20%;
  top: 20%;
  background-color: blue;
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
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(48, 74, 36, 0.6);
  position: absolute;
  margin: 0;
}

.form-popup-ban {
  display:flex;
  width:80%;
  background-color:yellow;
  flex-direction: column;
  align-items:center;
  justify-content: space-around;
}

.form-popup-ban input {
  width:40%;
}

.popup-ban-content {
  position: absolute;
  width: 40vw;
  height: 60vh;
  left: 20%;
  top: 20%;
  background-color: blue;
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
  width: 100vw;
  height: 100vh;
  background-color: rgba(48, 74, 36, 0.6);
  position: absolute;
  margin: 0;
}

.popup-settings-content {
  position: absolute;
  width: 40vw;
  height: 60vh;
  left: 20%;
  top: 20%;
  background-color: blue;
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

.popup-settings-add-participant {
  display: flex;
  flex-direction: column;
  width: 80%;
  background-color: aqua;
}

/* incoming

.popup-settings-add-participant {

}

.popup-settings-change-status {

}*/

.row-participant {
  background-color: #999;
}

.message {
  flex: 3;
}

.send {
  flex: 1;
}

.partipants {
  width: 30%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}


</style>