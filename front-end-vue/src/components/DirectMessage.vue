<template>
  <div class="chat_and_participant">
    <div class="chat">
      <div class="title">
        <span> direct message with {{data.name}}</span>
      </div>

      <template>
        <div class="messages">
          <p
            v-for="(message, index) in messages"
            :key="index"
          >{{message.userName}}: {{message.content}}</p>
        </div>
      </template>


      <form @submit.prevent="send_message()" class="buttons">
        <input class="message" type="text" placeholder="type your message here" v-model="messageTyping" />
        <input class="send" type="submit" value="send" />
      </form>
    </div>

    <!-- participants -->
    <div class="partipants">
        <span> You</span>
          <div class="row-participant">
            <span> {{data.name}}</span>
            <button @click="duelFriend()">Duel (wip) </button>
          </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
import store from "../store";

export default Vue.extend({
  name: "DirectMessage",
  props: ["data"],
  data() {
    return {
      channel: undefined as any,
      messages: undefined as any,
      messageTyping: undefined as any
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
  },
  methods: {
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
    duelFriend() {
        alert('you sent a duel');
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
  background-color: #999;
}

.partipants {
  width: 30%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

.messages {
  overflow-y: auto;
  display:flex;
  flex-direction:column-reverse;
  height:80%;

}

.buttons {
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10%;
}

.message {
  flex: 3;
}

.send {
  flex: 1;
}

</style>