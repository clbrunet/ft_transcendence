<template>
    <div>
      <p>{{duelid}}</p>
      <h1>Vous pouvez jouer avec flèche du haut / bas</h1>
      <canvas
        v-if="!game_won"
        ref="Game"
        :width="canvas.width"
        :height="canvas.height"
        style="border: 1px solid black"
        id="canvas"
      >
      </canvas>
      <h2 v-if="!game_won">Points : {{ left_point }} : {{ right_point }}</h2>
      <div v-else>
        <div>
          <span v-if="(side == 'left' && winner == 'left') || (side == 'right' && winner == 'right')">Vous avez gagné !</span>
          <span v-else>Vous avez perdu</span>
          <button @click="goToProfile()">Retour</button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import router from '../router'
import Store from '../store'
import axios from 'axios'

export default Vue.extend({
    name: 'Duel',
    store: Store,
    data() {
        return {
            duelid: undefined as any,
            gameid: undefined as any,
            game_won: false as any,
            left_point: undefined as any,
            right_point: undefined as any,
            winner: undefined as any,
            side: undefined as any,
            player_size: {
              width: 0 as any,
              height: 0 as any,
            } as any,
            canvas: {
              width: 0 as any,
              height: 0 as any,
            } as any,
            context: {} as any,
            position: [
              { x: 0, y: 0 } as any,
              { x: 0, y: 0 } as any,
            ] as any,
            nbPoints: undefined as any
        }
    },
    created() {
        window.addEventListener("keydown", (e) => {
        this.$store.state.socket.emit("move", {key:e.key, idDuel:this.duelid});
      });
    },
    mounted() {
        if (this.$route.params.id && (this.$store.state.gameid || this.$store.state.gameid2)) {
            this.duelid = this.$route.params.id;
        }
        else {
          router.push({name: 'Profile'})
        }

        if (this.$store.state.gameid)
          this.gameid = this.$store.state.gameid;
        else
          this.gameid = this.$store.state.gameid2;

        this.$store.state.socket.on('goBackProfile', (gameId: any) => {
          alert('The other user left the game');
          if (gameId == this.gameid)
          {
            router.push({name: 'Profile'});
            this.$store.state.socket.emit("game_won", this.duelid);
          }
        });

        this.$store.state.duelId = this.duelid; //a retirer avant de push

        let duelLaunch1 = false;
        let duelLaunch2 = false;

        this.$store.state.socket.emit('connection', {idDuel: this.duelid, validate: this.$store.state.duelId == this.duelid});

        if (this.$store.state.gameid)
        {
          this.nbPoints = this.$store.state.nbPoints;
          axios({
            url: process.env.VUE_APP_API_URL + "/game/launch1/" + this.gameid,
            method: "post",
            withCredentials: true,
            data: {
              pointToVictory: this.nbPoints
            }
            }).then(res => {
              duelLaunch1 = true;
            }).catch(err => {
              console.log("error gamelaunch1")
          });
        }



        this.$store.state.socket.on("data", (data: any) => {
            this.canvas.width = data.canvas.width;
            this.canvas.height = data.canvas.height;
            this.player_size.width = data.rect_width;
            this.player_size.height = data.rect_height;
        });

        const canv = document.getElementById('canvas') as HTMLCanvasElement;
        this.context = canv.getContext('2d');

        this.$store.state.socket.on("position", (obj: any) => {
            this.position[0] = obj[0];
            this.position[1] = obj[1];

            if (this.game_won == false)
            {
            this.context.clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            }
            this.drawPlayers(this.position[0], this.position[1]);
        });
        /**/

        this.$store.state.socket.on("ball_position", (ball: any) => {
        if (this.game_won == false && this.canvas.width != undefined && this.canvas.height != undefined)
        {
          this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
        }
  
        this.drawLine();
        this.drawBall(ball);
        this.drawPlayers(this.position[0], this.position[1]);
      });
  
      this.$store.state.socket.on("youAre", (side: any) => {
        this.$store.state.side = side;
        this.side = side;
      });

      var flagpassage = false;

      this.$store.state.socket.on("update_point", (data: any) => {

        if (data.idDuel == this.duelid)
        {

          this.left_point = data.points.left;
          this.right_point = data.points.right;

          if (this.$store.state.gameid2 && flagpassage == false)
          {
            axios({
              url: process.env.VUE_APP_API_URL + "/game/indexOngoing",
              withCredentials: true,
              method: "get"
            }).then(res => {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id == this.gameid)
                {
                  this.nbPoints = res.data[i].pointToVictory;
                  flagpassage = true;
                }
              }
            });
          }

          if (this.gameid && ((data.id == 'left' && this.side == 'left') || (data.id == 'right' && this.side == 'right')))
          {
            const url = `${process.env.VUE_APP_API_URL}/game/score/` + this.gameid;
            axios({
              method: "patch",
              url: url,
              withCredentials: true,
              data: {
                pointToVictory: this.nbPoints
              }
            }).catch(err => {
              console.log("");
            });
          }

          if (this.left_point >= this.nbPoints || this.right_point >= this.nbPoints) {
            this.game_won = true;
            this.$store.state.gameid = undefined;
            this.$store.state.side = undefined;
            this.$store.state.gameid2 = undefined;
            
            this.$store.state.socket.emit("game_won", this.duelid);
            if (this.left_point >= this.nbPoints) this.winner = "left";
            else this.winner = "right";
          }

        }
      });

    },
    methods: {
      drawPlayers: function (player1: any, player2: any) {
        this.context.fillStyle = "#FF4675";
        this.context.fillRect(
          player1.x,
          player1.y,
          this.player_size.width,
          this.player_size.height
        );
        this.context.fillRect(
          player2.x,
          player2.y,
          this.player_size.width,
          this.player_size.height
        );
      },
      drawLine: function() {
        this.context.beginPath();
        if (this.context != undefined)
        {
          this.context.moveTo(this.canvas.width / 2, 0);
          this.context.lineTo(this.canvas.width / 2, this.canvas.height);
        }
        this.context.strokeStyle = "#fff";
        this.context.stroke();
      },
      drawBall: function(ball: any)
      {
        this.context.beginPath();
        this.context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.fillStyle = "#fff";
        this.context.fill();
      },
      goToProfile() {
        router.push({name: 'Profile'});
      }
    }
})
</script>

<style scoped>
  canvas {
    background-color: #3043f0;
  }
</style>