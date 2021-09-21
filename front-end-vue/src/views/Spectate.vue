<template>
    <div id="body">
        <div id="content">
            <table v-if="matches.length != 0">
                <tr v-for="(match, index) in matches" :key="index">
                    <td> {{ match.players[0].userName }} vs {{ match.players[1].userName }} </td>
                    <td> {{ match.players[0].point }} - {{ match.players[1].point }} </td>
                    <td><button @click="spectate(match)">spectate</button></td>
                </tr>
            </table>
            <span v-else> No match on going...</span>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import router from '../router'

export default Vue.extend({
    name: 'Spectate',
    data() {
        return {
            matches: {} as any
        }
    },
    mounted() {
        const disc = document.getElementById("btn-disconnect");
        disc ? (disc.style.display = "inline-block") : 0;


        console.log("test");
        axios({
            url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
            method: "get",
            withCredentials: true
        }).then(res => {
            console.log("This matches = ", res);
            this.matches = res.data;
        })
    },
    methods: {
        spectate(match: any) {
            if (this.$store.state.user.id != undefined)
            {
                const path = "/duel/" + match.id;
                this.$store.state.duelId = match.id;
                this.$store.state.gameid = match.id;
                this.$store.state.nbPoints = match.pointToVictory;
                router.push({path: path}).catch(() => {
                    console.log("Redirection...");
                })
            }
        }
    }
})
</script>

<style scoped>
#body {
    height: 91vh;
    width:100%;
    display:flex;
    align-items:center;
    justify-content: center;
}

#content {
    background-color:green;
    width:60%;
    height:60%;
}
</style>