<template>
  <div id="body">
    <button class="size" @click="get_ongoing()">Refresh</button>
    <div id="content">
      <table v-if="matches.length != 0">
        <tr v-for="(match, index) in matches" :key="index">
          <td>
            <strong>{{ match.players[0].userName }}</strong> vs
            <strong>{{ match.players[1].userName }}</strong>
          </td>
          <td>
            <strong>{{ match.players[0].point }}</strong> -
            <strong>{{ match.players[1].point }}</strong>
          </td>
          <td>
            <button @click="spectate(match)" class="btn">spectate</button>
          </td>
        </tr>
      </table>
      <span v-else-if="loading == false">No match on going...</span>
      <span v-else-if="loading == true">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
import router from "../router";

export default Vue.extend({
  name: "Spectate",
  data() {
    return {
      matches: {} as any,
      loading: false
    };
  },
  mounted() {
    const disc = document.getElementById("btn-disconnect");
    disc ? (disc.style.display = "inline-block") : 0;

    /* check game ongoing */

    if (this.$store.state.user.id != undefined) {
      axios({
        url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
        method: "get",
        withCredentials: true
      }).then(res => {
        let allOngoing = res.data;

        for (let i = 0; i < allOngoing.length; i++) {
          if (
            allOngoing[i].players[0].userId == this.$store.state.user.id ||
            allOngoing[i].players[1].userId == this.$store.state.user.id
          ) {
            axios({
              url:
                process.env.VUE_APP_API_URL +
                "/game/unfinished/" +
                allOngoing[i].id,
              method: "patch",
              withCredentials: true
            }).then(() => {
              this.$store.state.socket.emit("gameBugged", {
                idGame: allOngoing[i].id,
                page: "Spectate",
                idUser: this.$store.state.user.id
              });
            });
          }
        }
      });
    }

    /**/

    axios({
      url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
      method: "get",
      withCredentials: true
    }).then(res => {
      this.matches = res.data;
    });
  },
  methods: {
    spectate(match: any) {
      if (this.$store.state.user.id != undefined) {
        const path = "/duel/" + match.id;
        this.$store.state.duelId = match.id;
        this.$store.state.gameid = match.id;
        this.$store.state.nbPoints = match.pointToVictory;
        router.push({ path: path }).catch(() => {
          console.log("Redirection...");
        });
      }
    },
    get_ongoing() {
      this.loading = true;
      axios({
        url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
        method: "get",
        withCredentials: true
      })
        .then(res => {
          this.matches = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
});
</script>

<style scoped>
#body {
  height: 91vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#content {
  background-color: white;
  border-radius: 25px;
  width: 60%;
}

table {
  padding: 2% 0 2% 0;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

tr {
  width: 100%;
}

td {
  font-size: 18px;
  padding: 1% 0 1% 0;
  text-align: center;
}

tr:nth-child(odd) {
  background-color: rgb(219, 219, 219);
}

.btn {
  outline: none;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  padding: 5%;
  cursor: pointer;
  background-color: #3040f0;
}

.btn:hover {
  background-color: rgb(19, 37, 231);
}

.size {
  padding: 2%;
  outline: none;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  padding: 1%;
  cursor: pointer;
  background-color: #3040f0;
  margin-bottom: 2%;
}

.size:hover {
  background-color: rgb(19, 37, 231);
}
</style>