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
        <td style="text-align:center;">Delete</td>
      </tr>
      <template v-for="(user, index) in users">
        <template v-if="user.id != $store.state.user.id">
          <tr :key="index">
            <td class="field clickable" @click="goToProfile(user)">{{user.name}}</td>
            <td class="field">{{user.email}}</td>
            <td class="field">{{user.isTwoFactorAuthenticationEnabled}}</td>
            <td class="field"><a v-bind:href="user.avatar" target="_blank">{{user.avatar}}</a></td>
            <td class="field">{{user.status}}</td>
            <td class="field">{{user.admin}} 
              <button class="btn" @click="toggleAdmin(user)">toggle</button>
            </td>
            <td class="field">{{user.inQueue}}</td>
            <td class="field">
              <img
                src="/assets/deny-button.svg"
                alt="delete"
                style="width:30px;cursor:pointer;"
                @click="deleteUser(user)"
              />
            </td>
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
      }).catch(() => {
        alert("error while getting users")
      });
    },
    deleteUser(user: any) {
      if (confirm("Warning : delete a user will also remove its messages in channels, channels of which he is the owner and history of games of which he is a player."
                  + " Do you really want to delete " + user.name + " ?")) {
        const url = `${process.env.VUE_APP_API_URL}/user/` + user.id;
        axios({
          url: url,
          method: "delete",
          withCredentials: true
        }).then(() => {
          this.get_users();
        }).catch((error) => {
          alert(error.response.data.message);
        });
      }
    },
    toggleAdmin(user: any) {
      let message: string;
      if (user.admin) {
        message = "Remove " + user.name + " from admins ?"
      }
      else {
        message = "Make " + user.name + " admin ?"
      }
      if (confirm(message)) {
        let url: string;
        if (user.admin) {
          url = `${process.env.VUE_APP_API_URL}/user/unadmin/` + user.id;
        }
        else {
          url = `${process.env.VUE_APP_API_URL}/user/admin/` + user.id;
        }
        axios({
          url: url,
          method: "patch",
          withCredentials: true
        }).then(() => {
          this.get_users();
        }).catch((error) => {
          alert(error.response.data.message);
        });
      }
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
  background-color: #3040F0;
  outline:none;
  border: 1px solid white;
  border-radius: 5px;
  cursor:pointer;
  color:white;
}

.btn:hover {
  background-color: rgb(21, 39, 235);
}

</style>
