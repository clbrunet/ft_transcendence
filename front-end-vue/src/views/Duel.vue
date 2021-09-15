<template>
    <div>
      <p>Bienvenue sur le duel {{duelid}}</p>
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
      <h2 v-else>The winner is the player on the {{ winner }}</h2>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from 'vue'
import router from '../router'
import Store from '../store'

export default Vue.extend({
    name: 'Duel',
    store: Store,
    data() {
        return {
            duelid: undefined as any,
            game_won: false as any,
            left_point: undefined as any,
            right_point: undefined as any,
            winner: undefined as any,
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
        }
    },
    created() {
        window.addEventListener("keydown", (e) => {
        this.$store.state.socket.emit("move", e.key);
      });
    },
    mounted() {
        if (this.$route.params.id) {
            this.duelid = this.$route.params.id;
        }
        else {
            router.push({name: 'Profile'})
        }
        this.$store.state.socket.emit('connection', this.duelid);

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
  
      this.$store.state.socket.on("update_point", (points: any) => {
        this.left_point = points.left;
        this.right_point = points.right;
        if (this.left_point >= 99999 || this.right_point >= 99999) {
          this.game_won = true;
          this.$store.state.socket.emit("game_won");
          if (this.left_point >= 3) this.winner = "left";
          else this.winner = "right";
        }
      });
      this.$store.state.socket.on("right_point", () => {
        this.right_point++;
        if (this.right_point >= 3) {
          this.game_won = true;
          this.$store.state.socket.emit("game_won");
          this.winner = "right";
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
      }
    }
})
</script>

<style scoped>
  canvas {
    background-color: #3043f0;
  }
</style>