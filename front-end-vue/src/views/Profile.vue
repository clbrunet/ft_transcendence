<template>
  <div class="profile">
    <div class="top">
      <div id="img">
        <img v-if="user.avatar" :src="getPath(user.avatar)" alt="Avatar" >
        <input type="file" accept="image/*" value="..." style="display:none;" @change="fileSelected" ref="fileInput">
        <button id="button-image" @click="$refs.fileInput.click()">...</button>
      </div>
      <div style="width:80%;height:100%;display:flex;flex-direction:column;justify-content:space-around;">
        <div class="logins">
          <span>{{user.name}}</span>
          <span>{{user.email}}</span>
        </div>
        <div class="stats">
          <span v-if="user.xp">{{user.xp}}xp</span>
          <span v-else>0xp</span>

          <span v-if="user.level">rank : {{user.level}}</span>
          <span v-if="user.nWins">{{user.nWins}}W / {{user.nLosses}}L</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="friends-blocks">
        <h2>Friends</h2>
        <div class="friends">
          <table>
            <template v-for="(friend, index) in user.friends">
              <template v-if="friend.requestStatus == 'accepted'">
                <tr :key="index">
                  <td style="width:50%;">{{ friend.friendName }}</td>
                  <td style="display:flex;align-items:center;justify-content:center;">{{ friend.userStatus }}
                      <img v-if="friend.userStatus == 'offline'" src="/assets/offline.svg" alt="offline" style="width:20%;">
                      <img v-else-if="friend.userStatus == 'online'" src="/assets/online.svg" alt="online" style="width:20%;">
                  </td>
                </tr>
              </template>
            </template>
          </table>
        </div>
        <h2>Blocks</h2>
        <div class="blocks">
          <table>
            <tr v-for="(block, index) in user.blocks" :key="index">
              <td>{{ block.blockName }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="game">
        <button id="play">PLAY</button>
      </div>
      <div class="match-history">
        <h2>Match history (WIP)</h2>
        <div class="matches">
          <table id=table-matches>
            <tr>
              <td>Match 1</td>
              <td>Win</td>
              <td>3-0</td>
            </tr>
            <tr>
              <td>Match 1</td>
              <td>Win</td>
              <td>3-1</td>
            </tr>
            <tr>
              <td>Match 1</td>
              <td>Lose</td>
              <td>2-3</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Store from "../store";
import axios from "axios";
import router from "../router";
export default Vue.extend({
  name: "Profile",
  store: Store,
  data() {
    return {
      user: {
        realPath: undefined,
        selectedFile: null
      }
    };
  },
  mounted() {
    if (this.$store.state.is_auth) {
      this.user = this.$store.state.user;
    }
  },
  methods: {
    getPath(avatar) {
      avatar = avatar.substring(10);
      return "/assets/" + avatar;
    },
    fileSelected(event) {
      this.selectedFile = event.target.files[0];
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      console.log(fd);
      console.log(this.selectedFile);
    }
  }
});
</script>

<style scoped>
#img {
  display:flex;
  align-items: center;
  margin-left: 2%;
  position:relative;
}
#img > img {
  border-radius: 100%;
  height: 142px;
  width: 142px;
}

#button-image {
  background-color: #ffffff;
  position:absolute;
  bottom:2%;
  right:2%;
  border-radius:100%;
  outline:none;
  border:1px solid #002a6e;
  width:25px;
  height:25px;
  cursor:pointer;
}

#button-image:hover {
  background-color: rgb(238, 238, 238);
}

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80vh;
}

.top {
  margin-top: 2%;
  width: 80vw;
  height: 27%;
  background-color: #002a6e;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  display: flex;
  flex-direction: row;
}

.logins {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #001333;
  width: 60%;
  height: 30%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
  color: white;
}

.stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #001333;
  width: 60%;
  height: 50%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
  color: white;
}

.logins :first-child {
  margin-left: 5%;
}

.logins :nth-child(2) {
  margin-right: 5%;
}

.bottom {
  height: 70%;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.friends-blocks {
  background-color: #ebebeb;
  flex: 3;
  height:100%;
  width:100%;
  display:flex;
  align-items: center;
  flex-direction: column;
  border-bottom-left-radius:25px;
}

.matches {
  background-color: white;
  max-height:80%;
  overflow-y: auto;
  overflow-x: hidden;
  display:flex;
  align-items: center;
  flex-direction: column;
  width:80%;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.friends {
  padding:1.5%;
  background-color: white;
  width: 80%;
  max-height:35%;
  overflow-y: auto;
  border-bottom-left-radius: 15px;
  display:flex;
  justify-content: center;
  border-bottom-right-radius: 15px;
}

table tr:nth-child(odd) {
  background-color: #ebebeb;
}

table {
  width:90%;
}

table tr {
  width:100%;
}

.blocks {
  padding:1.5%;
  background-color: white;
  max-height:35%;
  overflow-y: auto;
  width: 80%;
  border-bottom-left-radius: 15px;
  display:flex;
  justify-content: center;
  border-bottom-right-radius: 15px;
}

.game {
  background-color: #ebebeb;
  flex: 5;
  display:flex;
  align-items:center;
  justify-content: center;
}

.match-history {
  flex: 3;
  background-color: #ebebeb;
  border-bottom-right-radius:25px;
  display:flex;
  flex-direction:column;
  align-items:center;
}

#table-matches:nth-child(even){
  background-color:red;
}

#table-matches {
  padding: 2%;
}

h2 {
  color:white;
  background-color:#002a6e;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}

#play {
  background-color:red;
  border-radius:25px;
  border:3px solid black;
  width:42%;
  height:27%;
  font-size:50px;
  outline: none;
  color:white;
  cursor:pointer;
  font-weight: bold;
}

#play:hover {
  background-color:rgb(228, 0, 0);
}

</style>