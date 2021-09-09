<template>
  <div class="chat_and_participant">
    <div class="chat">
      <div class="title">
        <span>{{data.name}} by {{data.ownerName}}</span>
        <button v-if="isParticipant && isAdmin == true" @click="open_popup_settings()">settings</button>
      </div>
      <div class="messages">
        <p>bla bla messagaaaes simulés</p>
        <p>bla bla blaaaaaa</p>
        <p>bla bla blooo msg simulés</p>
        <p>bli blou bla bla blop</p>
      </div>
      <div class="buttons">
        <input class="message" type="text" placeholder="type your message here">
        <input class="send" type="submit" value="send">
      </div>
    </div>
    <div class="partipants">
      <template v-for="(participant, index) in participants">
        <template v-if="participant.userName == $store.state.user.name">
          <span :key="index" class="you">You</span>
        </template>
        <template v-else>
          <div class="row-participant" :key="index">
            <span> {{participant.userName}}</span>
            <button v-if="isOwner == true" @click="changeOwner(participant)">change owner</button>

            <button v-if="isOwner == true && participant.admin == false" @click="addAdmin(participant)">+ admin</button>
            <span v-else-if="isAdmin == true"> admin </span>

          </div>
        </template>
      </template>
    </div>
    <!-- absolute -->
    <div  v-if="popup_settings" class="popup-settings">
      <div class="popup-settings-content">
        settings....
        <button @click="close_popup_settings()">Close</button>
      </div>
    </div >
    <!-- -->
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import axios from "axios"
export default Vue.extend({
  name: "Chat",
  props: 
    ['data']
  ,
  data() {
    return {
      popup_settings: false,
      channel: undefined,
      participants: undefined,
      isOwner: false,
      isAdmin: false,
      isParticipant: false
    }
  },
  watch:  {
    data: function() {
      this.mounted_like();
    } 
  },
  mounted() {
    this.mounted_like();
  },
  methods : {
    mounted_like() {
      this.refresh_participants();

      console.log("this.$pros= ", this.data);

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
      console.log("Update : admin, participant, owner", this.isAdmin, this.isParticipant, this.isOwner);
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
        this.$props.data = res.data; //$props maybe
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
      const url = `${ process.env.VUE_APP_API_URL }/channel/addAdmin/`;
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
    close_popup_settings() {
      document.getElementById("nav").style.display = "flex";
      document.getElementById("list_channels").style.display = "block";
      this.popup_settings = false;
    },
    open_popup_settings() {
      document.getElementById("nav").style.display = "none";
      document.getElementById("list_channels").style.display = "none";
      this.popup_settings = true;
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

.popup-settings-content {
  position:absolute;
  width:40vw;
  height:60vh;
  left: 20%;
  top: 20%;
  background-color:blue;
  display:flex;
  flex-direction: column;
}

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