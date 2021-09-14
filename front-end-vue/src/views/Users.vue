<template>
  <div id="body">
    <div class="title"><h1>Users</h1></div>
    <table>
      <tr style="background-color:#aaa;">
        <td style="text-align:center;">Username</td>
        <td style="text-align:center;">Level</td>
        <td style="text-align:center;">XP</td>
        <td style="text-align:center;">Stats</td>
        <td style="text-align:center;">Duel</td>
        <td style="text-align:center;">Send DM</td>
        <td style="text-align:center;">Friends</td>
        <td style="text-align:center;">Blocks</td>
      </tr>
      <template v-for="(user, index) in users">
        <template v-if="user.id != $store.state.user.id">
          <tr :key="index">
            <td class="field clickable" @click="goToProfile(user)">{{user.name}}</td>
            <td class="field">{{user.level}}</td>
            <td class="field">{{user.xp}} xp</td>
            <td class="field">{{user.nWins}}W / {{user.nLosses}}L</td>
            <template v-if="is_blocked(user)">
              <td class="field">Blocked</td>
              <td class="field">Blocked</td>
              <td class="field">Blocked</td>
              <td class="field btnBox">
                <img
                    src="/assets/unblock.svg"
                    alt="unblock"
                    style="width:30px;cursor:pointer;"
                    @click="unblock(user)"
                />
              </td>
            </template>
            <template v-else-if="friends">
              <td class="field btnBox">
                <img
                    src="/assets/duel.svg"
                    alt="duel"
                    style="width:30px;cursor:pointer;"
                    @click="duel(user)"
                />
              </td>
              <td class="field btnBox">
                <img
                    src="/assets/direct-message.svg"
                    alt="send dm"
                    style="width:30px;cursor:pointer;"
                    @click="send_message(user)"
                />
              </td>
              <td class="field btnBox">
                <template v-if="tab[index] == 'received'">
                    <img
                        src="/assets/accept-button.svg"
                        alt="accept-button"
                        style="width:20px;cursor:pointer;margin-right:5px;"
                        @click="accept_friend_request(user)"
                    />
                    <img
                        src="/assets/deny-button.svg"
                        alt="deny-button"
                        style="width:20px;cursor:pointer;margin-left:5px;"
                        @click="deny_friend_request(user)"
                    />

                </template>
                <span class="field" v-else-if="tab[index] == 'sent'">Sent</span>
                <img
                    v-else-if="tab[index] == 'accepted'"
                    src="/assets/remove-friend.svg"
                    alt="remove-friend"
                    style="width:30px;cursor:pointer;"
                    @click="remove_friend(user)"
                />
                <img
                    v-else
                    src="/assets/add-friend.svg"
                    alt="add-friend"
                    style="width:30px;cursor:pointer;"
                    @click="add_friend(user)"
                />
              </td>
              <td class="field btnBox">
                <img
                    src="/assets/block.svg"
                    alt="block"
                    style="width:30px;cursor:pointer;"
                    @click="block(user)"
                />
              </td>
            </template>
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
import io from "socket.io-client"
import router from "../router";

export default Vue.extend({
  name: "Users",
  data() {
    return {
      users: {} as any,
      blocks: {} as any,
      friends: {} as any,
      tab: [] as any,
      socket: {} as any
    };
  },
  mounted() {
    this.socket = io("http://localhost:3000");
    this.socket.emit('message', {data: 'hello'});
    this.socket.on('message', (data: any) => {
      alert(data);
    });

    this.get_users();
    this.get_blocks();
  },
  methods: {
    get_users() {
      axios({
        url: `${process.env.VUE_APP_API_URL}/user/index`,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.users = res.data;
        this.get_friends();
      });
    },
    get_blocks() {
      axios({
        url: `${process.env.VUE_APP_API_URL}/block/index`,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.blocks = res.data;
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
    is_blocked(user: any) {
      if (this.blocks) {
        for (let i = 0; i < this.blocks.length; i++) {
          if (user.id == this.blocks[i].blockId) return true;
        }
      }
      return false;
    },
    duel(user: any) {
      alert(
        "you sent a duel to " + user.name + " as " + this.$store.state.user.name
      );
    },
    add_friend(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/friend/` + user.id;
      axios({
        url: url,
        method: "post",
        withCredentials: true
      }).then(() => {
        this.get_users();
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
      });
    },
    accept_friend_request(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/friend/accept/` + user.id;
      axios({
        url: url,
        method: "patch",
        withCredentials: true
      }).then(() => {
        this.get_users();
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
      });
    },
    block(user: any) {
      alert(this.$store.state.user.name + " wants to block " + user.name);
    },
    unblock(user: any) {
      alert(this.$store.state.user.name + " wants to unblock " + user.name);
    },
    send_message(user: any) {
      alert(
        this.$store.state.user.name + " wants to send a message to " + user.name
      );
    },
    goToProfile(user: any) {
      const path = "/profile/" + user.id;
      router.push({ path: path });
    }
  }
});
</script>

<style scoped>

.title {
  background-color:#3040F0;
  padding: 3%;
  width: 50vw;
  color:white;
  height:20px; 
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
}

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
  padding: 3%;
    width: 50vw;
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
}

td {
  text-align: left;
  margin: 0px;
  overflow: hidden;
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

.field {
  padding: 5px 15px 5px 15px;
  text-align:center;
}

.btn {
  cursor: pointer;
  height: 100%;
  margin-left: auto;
}
</style>
