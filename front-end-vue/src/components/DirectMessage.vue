<template>
  <div class="chat_and_participant">
    <div class="chat">
      <div class="title">
        <span> direct message with <span class="clickable" @click="goToProfile(data)">{{data.name}}</span></span>
      </div>
      <template>
        <div class="messages">
          <template v-for="(message, index) in messages">
            <p class="pbase" :key="index" v-if="message.userName != $store.state.user.name">
              <span style="font-weight:700;"> {{message.userName}}:</span> {{message.content}}
              <template v-if="message.button == true && message.userId != $store.state.user.id">
                <a @click="acceptDuel(message.userId, message.duelId)">accept</a> <a @click="rejectDuel(message.userId)">reject</a>
              </template>
            </p>
            <p class="pyou" :key="index" v-else>
              <span style="font-weight:700;"> {{message.content}}</span>
            </p>
          </template>
        </div>
      </template>


      <form @submit.prevent="send_message()" class="buttons">
        <input class="message" type="text" placeholder="type your message here" v-model="messageTyping" />
        <input class="send" type="submit" value="send" />
      </form>
    </div>

    <!-- participants -->
    <div class="partipants">
      <img class="close-chat-icon"
        src="/assets/close-chat.svg"
        alt="close chat icon"
        @click="closeChat()"
      />
      <span style="padding:1% 0 1% 0;"> You</span>
      <div class="row-participant">
        <span class="clickable" style="margin-right:2%;" @click="goToProfile(data)"> {{data.name}}</span>
        <template v-if="pendingDuel == false">
          <img
            src="/assets/duel.svg"
            alt="duel"
            style="width:30px;cursor:pointer;"
            @click="duelFriend()"
          />
          <form @submit.prevent="">
            <select v-model="nbPointsConfig" class="selectDuel">
              <option selected>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
import store from "../store";
import router from "../router";

export default Vue.extend({
  name: "DirectMessage",
  props: ["data"],
  store: store,
  data() {
    return {
      channel: undefined as any,
      messages: undefined as any,
      messageTyping: undefined as any,
      pendingDuel: false as any,
      nbPointsConfig: 5 as any
    };
  },
  watch: {
    data: function() {
      this.mounted_like();
    }
  },
  mounted() {
    this.mounted_like();

    this.$store.state.socket.on('chatToDm', (message: any) => {
      this.refresh_messages();
    });

    this.$store.state.socket.on('refreshDuels', (id: any) => {
      if (this.$store.state.user != undefined)
      {
        if (this.$store.state.user.id == id) {
          this.refresh_messages();
        }
      }
    });
  },
  methods: {
    closeChat() {
      this.$store.dispatch('desactivateChat');
    },
    mounted_like() {
      this.refresh_messages();
      this.refresh_channel();
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
          this.$store.state.socket.emit('dmToServer', {sender: this.$store.state.user.name, room:this.data.id, message: this.messageTyping});
          this.messageTyping = "";
        });
      }
    },
    refresh_channel() {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_API_URL}/channel/` + this.data.id,
        withCredentials: true
      }).then(res => {
        this.channel = res.data;
      });
    },
    refresh_messages() {
      const url = `${process.env.VUE_APP_API_URL}/message/all/` + this.data.id;
      axios({
        method: "get",
        url: url,
        withCredentials: true
      }).then(res => {
        this.pendingDuel = false;
        this.messages = res.data.reverse();
        for (let i = 0; i < this.messages.length; i++) {
          if (this.messages[i].button == true) {
            this.pendingDuel = true;
          }
        }
      }).catch(() => {
        console.log("No permission so see some of messages");
      });
    },
    duelFriend() {
      let newId: any;
      if (this.data.participants[0].userId != this.$store.state.user.id) {
        newId = this.data.participants[0].userId;
      }
      else {
        newId = this.data.participants[1].userId;
      }

      const url = `${process.env.VUE_APP_API_URL}/duel/` + newId;
      axios({
        url: url,
        method: "post",
        withCredentials: true
      }).then(res => {
        this.refresh_messages();
        this.$store.state.socket.emit('dmToServer', {sender: "sender", room:this.data.id, message: "message"});
        this.$store.state.socket.emit('duelDenied', {idRoom: "room", id: newId}); //just a refresh
        axios({
          url: `${process.env.VUE_APP_API_URL}/duel/go/` + newId,
          method: "post",
          withCredentials: true 
        }).then((res) => {
          this.$store.state.gameid = res.data.id;
          this.$store.state.nbPoints = this.nbPointsConfig;
        });
      }).catch(() => console.log(''));
    },
    goToProfile(user: any) {
      if (user.participants[0].userId != this.$store.state.user.id) {
        var path = "/profile/" + user.participants[0].userId;
      }
      else {
        var path = "/profile/" + user.participants[1].userId;
      }
      router.push({ path: path });
    },
    acceptDuel(userId: string, duelId: string) {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/duel/accept/` + userId,
        method: "patch",
        withCredentials: true
      }).then(res => {
        if (res.data == 'Duel cancelled since at least one of the User is offline' ||
          res.data == 'Duel cancelled since at least one of the User is already in-game')
        {
          let newId;
          if (this.data.participants[0].userId != this.$store.state.user.id) {
            newId = this.data.participants[0].userId;
          }
          else {
            newId = this.data.participants[1].userId;
          }
          this.$store.state.socket.emit('duelDenied', {idRoom: this.data.id, id: newId})
          alert(res.data);
          this.refresh_messages();
        }
        else
        {
          this.refresh_channel();
          this.refresh_messages();
          this.$store.state.gameid2 = res.data.id;
          let newId;
          if (this.data.participants[0].userId != this.$store.state.user.id) {
            newId = this.data.participants[0].userId;
          }
          else {
            newId = this.data.participants[1].userId;
          }
          this.$store.state.socket.emit('duelAccepted', {idRoom: this.data.id, id: newId, ownerId: this.$store.state.user.id, duelId: res.data.id})
        }
      }).catch(err => {
        console.log("")
      });
    },
    rejectDuel(userId: string) {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/duel/reject/` + userId,
        method: "patch",
        withCredentials: true
      }).then(res => {
        this.pendingDuel = false;
        this.refresh_channel();
        this.refresh_messages();
        let newId;
        if (this.data.participants[0].userId != this.$store.state.user.id) {
          newId = this.data.participants[0].userId;
        }
        else {
          newId = this.data.participants[1].userId;
        }
        this.$store.state.socket.emit('duelDenied', {idRoom: this.data.id, id: newId})
      });
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

.row-participant {
  background-color: rgb(245, 62, 108);
  width: 100%;
  color:white;
  padding: 1% 0 1% 0;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selectDuel {
  background-color: #3040F0;
  color:white;
  padding: 1%;
}

.row-participant span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}

.chat {
  display: flex;
  outline: 1px solid black;
  width: 70%;
  height: 100%;
  flex-direction: column;
  background-color:rgb(250, 99, 137);
}

.title {
  color: white;
  font-weight:700;
  background-color: #3040F0;
  padding: 15px;
  max-height: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title span {
  white-space: nowrap;
}

.messages {
  overflow-y: auto;
  display:flex;
  flex-direction:column-reverse;
  height:100%;
}

.buttons {
  display: flex;
  width: 100%;
  height: 10%;
}

p {
  padding: 1% 0 1% 0;
  margin:0;
  color:black;
}

.partipants {
  width: 30%;
  height: 100%;
  background-color: rgb(68, 96, 253);
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid black;
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

.send {
  flex: 1;
}

a {
  text-decoration:underline;
  color:blue;
}

a:hover {
  cursor:pointer;
}

.close-chat-icon {
  display: none;
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

  .partipants {
    border: none;
  }
}



</style>
