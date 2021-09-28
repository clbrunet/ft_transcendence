<template>
  <div id="body">
    <table>
      <tr style="background-color:#aaa;">
        <td style="text-align:center;">Username</td>
        <td style="text-align:center;">Email</td>
        <td style="text-align:center;">2FA</td>
        <td style="text-align:center;">Avatar</td>
        <td style="text-align:center;">Status</td>
        <td style="text-align:center;">Admin</td>
        <td style="text-align:center;">inQueue</td>
      </tr>
      <template v-for="(user, index) in users">
        <template v-if="user.id != $store.state.user.id">
          <tr :key="index">
            <td class="field clickable" @click="goToProfile(user)">{{user.name}}</td>
            <td class="field">{{user.email}}</td>
            <td class="field">{{user.isTwoFactorAuthenticationEnabled}}</td>
            <td class="field"><a v-bind:href="user.avatar" target="_blank">{{user.avatar}}</a></td>
            <td class="field">{{user.status}}</td>
            <td class="field">{{user.admin}}</td>
            <td class="field">{{user.inQueue}}</td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
import router from "../router";
import Store from "../store";

export default Vue.extend({
  name: "Admin",
  store: Store,
  data() {
    return {
      users: {} as any,
      blocks: {} as any,
      friends: {} as any,
      tab: [] as any,
    };
  },
  mounted() {

    const disc = document.getElementById("btn-disconnect");
    disc ? (disc.style.display = "inline-block") : 0;


    this.get_users();

    this.$store.state.socket.on('refreshAllUsers', (idUser: any) => {
      if (this.$store.state.user.id == idUser || idUser == 'all')
      {
        this.get_users();
      }
    });
  },
  methods: {
    get_users() {
      axios({
        url: `${process.env.VUE_APP_API_URL}/user/all`,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.users = res.data;
        this.get_friends();
      });
    },
    get_friends() {
      axios({
        url: `${process.env.VUE_APP_API_URL}/friend/index`,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.friends = res.data;
        this.tab.length = 0;
        for (let i = 0; i < this.users.length; i++) {
          var flag = false;
          for (let j = 0; j < this.friends.length; j++) {
            if (this.users[i].id == this.friends[j].friendId) {
              this.tab.push(this.friends[j].requestStatus);
              flag = true;
            }
          }
          if (flag == false) this.tab.push("none");
        }
      });
    },
    add_friend(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/friend/` + user.id;
      axios({
        url: url,
        method: "post",
        withCredentials: true
      }).then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshUsers', user.id);
      });
    },
    remove_friend(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/friend/unfriend/` + user.id;
      axios({
        url: url,
        method: "delete",
        withCredentials: true
      }).then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshUsers', user.id);
      });
    },
    accept_friend_request(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/friend/accept/` + user.id;
      axios({
        url: url,
        method: "patch",
        withCredentials: true
      })
      .then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshUsers', user.id);
      })
      .catch(() => {
        alert("please retry accepting the friend request after a refresh")
      });
    },
    deny_friend_request(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/friend/reject/` + user.id;
      axios({
        url: url,
        method: "patch",
        withCredentials: true
      }).then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshUsers', user.id);
      });
    },
    block(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/block/` + user.id;
      axios({
        url: url,
        method: "post",
        withCredentials: true
      }).then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshChannels');
        this.$store.state.socket.emit('refreshUsers', user.id);
      });
    },
    unblock(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/block/unblock/` + user.id;
      axios({
        url: url,
        method: "delete",
        withCredentials: true
      }).then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshChannels');
        this.$store.state.socket.emit('refreshUsers', user.id);
      });
    },
    send_message(user: any) {
      axios({
        url: `${process.env.VUE_APP_API_URL}/direct/go/` + user.id,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.$store.state.goDM = res.data;
        this.$store.state.socket.emit('refreshChannels');
        router.push({name: "Chats"});
      });
    },
    goToProfile(user: any) {
      const path = "/profile/" + user.id;
      router.push({ path: path });
    },
  }
});
</script>

<style scoped>

h1 {
  margin:0;
  padding:0;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}

#body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(250, 99, 137);
  height: 91vh;
  width: 100%;
  flex-direction: column;
}

table {
  border: 1px solid #3040F0;
  background-color:white;
  align-self: center;
  justify-self: center;
  padding: 25px;
  width: auto;
  max-width: 90%;
  height: auto;
  max-height: 70%;
  border-radius: 15px;
  overflow-y: scroll;
  display: inline-block;
  margin: 10px;
}

::-webkit-scrollbar {
  background: #aaa;
  width: 15px;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

::-webkit-scrollbar-thumb {
  background: #3040F0;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

::-webkit-scrollbar:horizontal {
  background: #aaa;
  border-radius: 0;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

::-webkit-scrollbar-thumb:horizontal {
  background: #3040F0;
  border-radius: 0;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

td {
  text-align: left;
  min-width: 56px;
  max-width: 150px;
  margin: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
tr:nth-child(even) {
  color: white;
  background-color: #3040F0;
  border: 1px solid black;
}

tr {
  margin: 0;
  background-color: #ededed;
  padding: 3%;
}

.nbPoints {
  color:black;
}

.selectDuel {
  background-color: #3040F0;
  color:white;
  padding: 1%;
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

.field {
  padding: 5px 15px 5px 15px;
  text-align:center;
}

.field a {
  color: inherit;
  text-decoration: none;
}

.field a:hover {
  text-decoration: underline;
}

.btn {
  cursor: pointer;
  height: 100%;
  margin-left: auto;
}

h3 {
  color: black;
}
</style>
