<template>
  <div class="chat_and_participant">
    <div class="chat">
      <div class="title">
        <span>{{data.name}} by {{data.ownerName}}</span>
        <button v-if="isOwner == true" @click="open_popup_settings()">settings</button>
      </div>

      <template v-if="data.status == 'public' || (isParticipant == true && data.activeUserBan == false)">
        <div class="messages">
          <p v-for="(message, index) in messages" :key="index"> {{message.userName}}: {{message.content}}</p>
        </div>
      </template>
      <template v-else>
        <div class="messages">
          <p v-if="isParticipant == false">you are not a participant of this channel</p>
          <p v-else-if="data.activeUserBan == true">you were banned from this channel</p>
        </div>
      </template>


      <div class="buttons" v-if="isParticipant == true && data.activeUserBan == false && data.activeUserMute == false">
        <input class="message" type="text" placeholder="type your message here">
        <input class="send" type="submit" value="send">
      </div>
      <div class="buttons" v-else>
        <template v-if="isParticipant == false">
          <input class="message" type="text" placeholder="you are not a partcipant from this channel" disabled>
          <input class="send" type="submit" value="not participant" disabled>
        </template>
        <template v-else-if="data.activeUserBan == true">
          <input class="message" type="text" placeholder="you were banned from this channel" disabled>
          <input class="send" type="submit" value="banned" disabled>
        </template>
        <template v-else-if="data.activeUserMute == true">
          <input class="message" type="text" placeholder="you were muted from this channel" disabled>
          <input class="send" type="submit" value="muted" disabled>
        </template>
      </div>

    </div>

    <!-- participants -->
    <div class="partipants" v-if="data.activeUserBan == false">
      <template v-for="(participant, index) in participants">
        <template v-if="participant.userName == $store.state.user.name">
          <span :key="index" class="you">You</span>
        </template>
        <template v-else>
          <div class="row-participant" :key="index">
            <span> {{participant.userName}}</span>
            
            <template v-if="participant.ban == false">
              <button v-if="isOwner == true" @click="changeOwner(participant)">change owner</button>
              <button v-if="isOwner == true && participant.admin == false" @click="addAdmin(participant)">+ admin</button>
              <button v-else-if="isOwner == true" @click="removeAdmin(participant)">- admin</button>
            </template>
            <template v-else>
                <button>unban (WIP)</button>
            </template>
          </div>

        </template>
      </template>
    </div>
    <div class="partipants" v-else>
      <span> You were banned from this channel </span> 
    </div>
    <!-- absolute -->

    <div  v-if="popup_settings" class="popup-settings">
      <div class="popup-settings-content">
        <div class="popup-settings-content-rows">
          <div class="popup-settings-add-participant">
            <h3>Add participants : </h3>
            <div v-if="usersParticipants.length != 0" style="display:flex;flex-direction:column;color:white;">
              <template v-for="(user, index) in usersParticipants" >
              <div :key="index">
                <span>{{ user.name }} </span>
                <button @click="addParticipant(user)">ajouter</button>
              </div>
              </template>
            </div>
          </div>
          <div class="popup-settings-change-status">
            <h3>Change status : </h3>

          </div>
        </div>
        <button @click="close_popup_settings()" id="popup-settings-btn">Close</button>
      </div>
    </div >
    <!-- -->
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue"
import axios from "axios"
export default Vue.extend({
  name: "Chat",
  props: 
    ['data']
  ,
  data() {
    return {
      popup_settings: false as any ,
      channel: undefined as any,
      participants: undefined as any,
      messages: undefined as any,
      users: undefined as any,
      isOwner: false as any,
      isAdmin: false as any,
      isParticipant: false as any,
      usersParticipants: [] as any
    }
  },
  watch:  {
    data: function() {
      this.mounted_like();
    },
    participants: function () {
      this.getUsersParticipants();
    },
    users: function () {
      this.getUsersParticipants();
    }
  },
  mounted() {
    this.mounted_like();
  },
  methods : {
    mounted_like() {
      this.refresh_participants();
      this.refresh_users();
      this.refresh_messages();

      if (this.data.activeUserAdmin == true)
        this.isAdmin = true;
      else
        this.isAdmin = false;
  
      if (this.data.activeUserParticipant == true)
        this.isParticipant = true;
      else
        this.isParticipant = false;

      if (this.data.ownerId == this.$store.state.user.id)
        this.isOwner = true;
      else
        this.isOwner = false;
    },
    refresh_participants() {
      const url = `${ process.env.VUE_APP_API_URL }/channel/` + this.data.id;
      axios({
        method: "get",
        url: url,
        withCredentials: true
      })
      .then(res => {
        this.participants = res.data.participants;
      });
    },
    refresh_channel() {
        axios({
        method: "get",
        url: `${ process.env.VUE_APP_API_URL }/channel/` + this.data.id,
        withCredentials: true
      })
      .then(res => {
        this.$props.data = res.data;
      });
    },
    refresh_users() {
      const url = `${ process.env.VUE_APP_API_URL }/user/index`
      axios({
        method: "get",
        url: url,
        withCredentials: true
      })
      .then(res => {
        this.users = res.data;
      });
    },
    refresh_messages() {
      const url = `${ process.env.VUE_APP_API_URL }/message/all/` + this.data.id
      axios({
        method: "get",
        url: url,
        withCredentials: true
      })
      .then(res => {
        this.messages = res.data;
      });
    },
    changeOwner(participant: any) {
      const url = `${ process.env.VUE_APP_API_URL }/channel/changeOwner/` + this.data.id;
      axios({
        method: "patch",
        url: url,
        withCredentials: true,
        data: {
          ownerId: participant.userId
        }
      })
      .then(() => {
        this.refresh_channel();
      });
    },
    addAdmin(participant: any) {
      const url = `${ process.env.VUE_APP_API_URL }/channel/admin/true`;
      axios({
        method: "post",
        url: url,
        withCredentials: true,
        data: {
          userId: participant.userId,
          channelId: this.data.id
        }
      })
      .then(() => {
        this.refresh_participants();
      });
    },
    removeAdmin(participant: any) {
      const url = `${ process.env.VUE_APP_API_URL }/channel/admin/false`;
      axios({
        method: "post",
        url: url,
        withCredentials: true,
        data: {
          userId: participant.userId,
          channelId: this.data.id
        }
      })
      .then(() => {
        this.refresh_participants();
      });
    },
    addParticipant(user: any) {
      const url = `${ process.env.VUE_APP_API_URL }/channel/addParticipant`;
      axios({
        method: "post",
        url: url,
        withCredentials: true,
        data: {
          userId: user.id,
          channelId: this.data.id
        }
      })
      .then(() => {
        this.refresh_participants();
      });
    },
    close_popup_settings() {
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "flex" : 0 ;
      const list_channels = document.getElementById("list_channels");
      list_channels ? list_channels.style.display = "block" : 0 ;
      this.popup_settings = false;
    },
    open_popup_settings() {
      const nav = document.getElementById("nav");
      nav ? nav.style.display = "none" : 0 ;
      const list_channels = document.getElementById("list_channels");
      list_channels ? list_channels.style.display = "none" : 0 ;
      this.popup_settings = true;
      this.getUsersParticipants();
    },
    getUsersParticipants() {
      this.usersParticipants.length = 0;

      for (let i = 0; i < this.users.length; i++) {
        var check = false;
        for (let j = 0; j < this.participants.length; j++) {
          if (this.users[i].id == this.participants[j].userId)
          {
            check = true;
          }
        }
        if (check == false)
        {
          this.usersParticipants.push({id:this.users[i].id, name: this.users[i].name});
        }
      }
    }
  }
});
</script>

<style scoped>

.chat_and_participant {
  display:flex;
  justify-content: center;
  width: 100%;
  height: 91vh;
  position: relative;
}

.chat{
  display:flex;
  border: 1px solid black;
  width:60%;
  flex-direction:column;
  position:relative;
  background-color: #aaa;
}

.title {
  color:white;
  background-color:black;
  padding:15px;
}

.you {
  font-style: italic;
}

.buttons{
  display:flex;
  position:absolute;
  bottom:0;
  width:100%;
  height:10%;
}

.popup-settings {
  z-index: 1000;
  width:100vw;
  height:100vh;
  background-color:rgba(48, 74, 36, 0.6);
  position: absolute;
  margin:0;
}

.popup-settings-content-rows {
  display:flex;
  width:100%;
  justify-content: space-around;
  height:75%;
}

.popup-settings-content {
  position:absolute;
  width:40vw;
  height:60vh;
  left: 20%;
  top: 20%;
  background-color:blue;
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:space-around;
}

#popup-settings-btn {
  width: 25%;
  cursor:pointer;
  padding: 2%;
}

.popup-settings-add-participant, .popup-settings-change-status {
  display:flex;
  flex-direction: column;
  width:50%;
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
  flex:3;
}

.send{
  flex:1;
}

.partipants {
  width: 30%;
  height:100%;
  background-color: white;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
}

</style>