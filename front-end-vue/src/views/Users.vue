<template>
  <div id="body">
      <div class="settings">
        <h3>Duel's settings :</h3>
        <div class="settings-points">
          <span class="nbPoints"> Number of points </span>
          <select v-model="nbPointsConfig" class="selectDuel">
            <option selected>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </select>
        </div>
      </div>
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
            <template v-if="tabBlocks[index] == 'blocker' || tabBlocks[index] == 'blocked'">
              <td class="field">Blocked</td>
              <td class="field">Blocked</td>
              <td class="field">Blocked</td>
              <td v-if="tabBlocks[index] == 'blocker'" class="field btnBox">
                <img
                  src="/assets/unblock.svg"
                  alt="unblock"
                  style="width:30px;cursor:pointer;"
                  @click="unblock(user)"
                />
              </td>
              <td v-else class="field">Blocked</td>
            </template>
            <template v-else-if="friends">
              <td class="field btnBox">
                <img
                  v-if="tabDuels != undefined && tabDuels[index] != undefined && tabDuels[index].status == 'none'"        
                  src="/assets/duel.svg"
                  alt="duel"
                  style="width:30px;cursor:pointer;"
                  @click="duel(user)"
                />
                <button class="btn-ok" v-else-if="tabDuels != undefined && tabDuels[index] != undefined && tabDuels[index].status == 'sent'" @click="unduel(user)">Unduel</button>
                <template v-else-if="tabDuels != undefined && tabDuels[index] != undefined && tabDuels[index].status == 'received'">
                  <img
                    src="/assets/accept-button.svg"
                    alt="accept-button"
                    style="width:20px;cursor:pointer;margin-right:5px;"
                    @click="accept_duel(user, tabDuels[index].id)"
                  />
                  <img
                    src="/assets/deny-button.svg"
                    alt="deny-button"
                    style="width:20px;cursor:pointer;margin-left:5px;"
                    @click="deny_duel(user)"
                  />
                </template>
                <img
                  v-else        
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
      socket: {} as any,
      tabBlocks: [] as any,
      duels: [] as any,
      tabDuels: undefined as any,
      nbPointsConfig: 3 as any
    };
  },
  mounted() {

    const disc = document.getElementById("btn-disconnect");
    disc ? (disc.style.display = "inline-block") : 0;


    this.get_users();
    this.get_blocks();
    this.get_duels();

    this.$store.state.socket.on('refreshDuels', (id: any) => {
      if (this.$store.state.user != undefined)
      {
        if (this.$store.state.user.id == id)
        {
          this.get_duels();
        }
      }
    });

    this.$store.state.socket.on('refreshAllUsers', (idUser: any) => {
      if (this.$store.state.user.id == idUser || idUser == 'all')
      {
        this.get_users();
      }
    })

    /* check game ongoing */
    if (this.$store.state.user != undefined)
    {
    axios({
      url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
      method: "get",
      withCredentials: true
    }).then(res => {
      let allOngoing = res.data;

      for (let i = 0; i < allOngoing.length; i++)
      {
        if (allOngoing[i].players[0].userId == this.$store.state.user.id || allOngoing[i].players[1].userId == this.$store.state.user.id)
        {
          axios({
            url: process.env.VUE_APP_API_URL + "/game/unfinished/" + allOngoing[i].id,
            method: "patch",
            withCredentials: true
          }).then(() => {
            this.$store.state.socket.emit('gameBugged', {idGame:allOngoing[i].id, page:'Users', idUser: this.$store.state.user.id});
          })
        }
      }
    });
    }
    /**/
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
        this.get_blocks();
      });
    },
    get_blocks() {
      axios({
        url: `${process.env.VUE_APP_API_URL}/block/index`,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.blocks = res.data;
        this.tabBlocks.length = 0;
        for (let i = 0; i < this.users.length; i++) {
          var flag = false;
          if (this.users[i].id != this.$store.state.user.id)
          {
            var flag = false;
            for (let j = 0; j < this.blocks.length; j++) {
              if (this.users[i].id == this.blocks[j].blockId) {
                this.tabBlocks.push(this.blocks[j].status);
                flag = true;
              }
            }
          }
          if (flag == false) this.tabBlocks.push("none");
        }
      });
    },
    get_duels() {
      axios({
        url: `${process.env.VUE_APP_API_URL}/duel/index`,
        method: "get",
        withCredentials: true
      }).then(res => {
        this.duels = res.data;
        if (this.tabDuels != undefined)
          this.tabDuels.length = 0;
        else
          this.tabDuels = [];
        for (let i = 0; i < this.users.length; i++) {
          var flag = false;
          for (let j = 0; j < this.duels.length; j++) {
            if (this.users[i].id == this.duels[j].duelId) {
              this.tabDuels.push({status:this.duels[j].status, id: this.duels[j].id});
              flag = true;
            }
          }
          if (flag == false) this.tabDuels.push({status: "none"});
        }
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
    duel(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/duel/` + user.id;
      axios({
        url: url,
        method: "post",
        withCredentials: true
      }).then(res => {
        this.get_users();
        this.get_duels();
        axios({
          url: `${process.env.VUE_APP_API_URL}/direct/go/` + user.id,
          method: "get",
          withCredentials: true
        }).then(res => {
          let newId;
          if (res.data.participants[0].userId != this.$store.state.user.id) {
            newId = res.data.participants[0].userId;
          }
          else {
            newId = res.data.participants[1].userId;
          }
          
          this.$store.state.socket.emit('duelSent', {idRoom: res.data.id, id: newId});
          this.$store.state.socket.emit('duelDenied', {idRoom: "room", id: user.id})
          axios({
            url: `${process.env.VUE_APP_API_URL}/duel/go/` + user.id,
            method: "post",
            withCredentials: true 
          }).then((res) => {
            if (res.data == 'Duel cancelled since the active User is already in-game')
            {
              alert('you were already in a game, you can now play');
              axios({
                    url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
                    method: "get",
                    withCredentials: true
                  }).then(res => {
                    let allOngoing = res.data;

                    for (let i = 0; i < allOngoing.length; i++)
                    {
                      if (allOngoing[i].players[0].userId == this.$store.state.user.id || allOngoing[i].players[1].userId == this.$store.state.user.id)
                      {
                        axios({
                          url: process.env.VUE_APP_API_URL + "/game/unfinished/" + allOngoing[i].id,
                          method: "patch",
                          withCredentials: true
                        }).then(() => {
                          this.$store.state.socket.emit('gameBugged', {idGame:allOngoing[i].id, page:'Profile', idUser: this.$store.state.user.id});
                        })
                      }
                    }
                  }).catch(() => console.log(""));
            }
            else if (this.$store.state.user.id != undefined)
            {
              this.$store.state.gameid = res.data.id;
              this.$store.state.nbPoints = this.nbPointsConfig;
            }
          });
        });
      }).catch(() => console.log(''));
    },
    unduel(user: any) {
      const url = `${process.env.VUE_APP_API_URL}/duel/unduel/` + user.id;
      axios({
        url: url,
        method: "delete",
        withCredentials: true
      }).then(res => {
        this.get_users();
        this.get_duels();

        axios({
          url: `${process.env.VUE_APP_API_URL}/direct/go/` + user.id,
          method: "get",
          withCredentials: true
        }).then(res => {
          let newId;
          if (res.data.participants[0].userId != this.$store.state.user.id) {
            newId = res.data.participants[0].userId;
          }
          else {
            newId = res.data.participants[1].userId;
          }
          this.$store.state.socket.emit('duelDenied', {idRoom: "room", id: user.id})
          this.$store.state.socket.emit('duelSent', {idRoom: res.data.id, id: newId})
        });
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
      }).then(() => {
        this.get_users();
        this.$store.state.socket.emit('refreshUsers', user.id);
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
        this.get_blocks();
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
        this.get_blocks();
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
    accept_duel(user: any, duelId: any) {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/duel/accept/` + user.id,
        method: "patch",
        withCredentials: true
      }).then(res => {
        if (res.data == 'Duel cancelled since the other User is offline' ||
            res.data == 'Duel cancelled since at least one of the User is already in-game')
        {
          this.$store.state.socket.emit('duelDenied', {idRoom: 'room', id: user.id})
          alert(res.data);
          this.get_duels();
        }
        else
        {
          this.get_duels();
          this.$store.state.gameid2 = res.data.id;
          this.$store.state.socket.emit('duelAccepted', {idRoom: "room", id: user.id, ownerId: this.$store.state.user.id, duelId: res.data.id})
        }
        this.get_duels();
      }).catch(err => {
        alert('Duel cancelled because of other user disconnected')
        this.get_duels();
      });
    },
    deny_duel(user: any) {
      axios({
        url: `${ process.env.VUE_APP_API_URL }/duel/reject/` + user.id,
        method: "patch",
        withCredentials: true
      }).then(res => {
        this.get_duels();
        this.$store.state.socket.emit('duelDenied', {idRoom: "room", id: user.id})
      }).catch(err => {
        console.log("");
      })
    }
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

.settings-points{
  width:80%;
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

.btn {
  cursor: pointer;
  height: 100%;
  margin-left: auto;
}

.settings {
  background-color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction: column;
  padding:  0.5% 1.8% 0.5% 1.8%;
  border-radius:15px;
  border: 1px solid #3040F0;
  color:white;
  width:25%;
}

h3 {
  color: black;
}

</style>
