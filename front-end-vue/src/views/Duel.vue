<template>
  <div id="body">
    <template v-if="!game_won">
      <h1 v-if="side == 'left' || side == 'right'">You can play with up/down arrow</h1>
      <div v-else>
        <h1>You are spectating</h1>
        <h1 v-if="name_left && name_right">{{name_left}} vs {{name_right}}</h1>
      </div>
      <h3 v-if="side == 'left' || side == 'right'">You're playing on the {{side}} side</h3>
    </template>
    <canvas
      :class="colors[$store.state.colorConfig]"
      v-if="!game_won"
      ref="Game"
      :width="canvas.width / ratio"
      :height="canvas.height / ratio"
      style="border: 1px solid black"
      id="canvas"
    >
    </canvas>
    <div v-if="!game_won && (side == 'left' || side == 'right')">
      <button v-if="isMobile" id="up">up</button>
      <button v-if="isMobile" id="down">down</button>
    </div>
    <h2 v-if="!game_won">Points : {{ left_point }} : {{ right_point }}</h2>
    <div v-else>
      <div class="ending">
        <span class="ended" v-if="(side == 'left' && winner == 'left') || (side == 'right' && winner == 'right')">You won this match !</span>
        <span class="ended" v-else-if="(side == 'left' || side == 'right')">You lost this match</span>
        <span class="ended" v-else>Game is ended</span>
        <button @click="goToProfile()">Go back</button>
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
      nbPoints: undefined as any,
      windowWidth: undefined as any,
      windowHeight: undefined as any,
      ratio: 1 as any,
      colors: ['blue', 'yellow', 'green', 'violet'] as any,
      name_right: undefined as any,
      name_left: undefined as any,
      isMobile: false,
    }
  },
  created() {
    window.addEventListener("keydown", (e) => {
      this.$store.state.socket.emit("move", {key:e.key, idDuel:this.duelid});
    });
  },
  mounted() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.isMobile = true;
    }
    var sockeet = this.$store.state.socket;
    var idGAME = this.$route.params.id;

    if (this.$store.state.spec != undefined)
    {
      this.left_point = this.$store.state.spec[0];
      this.right_point = this.$store.state.spec[1];
      this.$store.state.socket.on('getSide', (data: any) => {
        if (data.idRoom == idGAME)
        {
          if (data.side == 'left')
          this.name_left = data.username;
          else if (data.side == 'right')
          this.name_right = data.username;
        }
      });
      this.$store.state.socket.emit('getSides', idGAME);
    }

    var mousedownIDUP:any = -1;
    function mousedownUP(event: any) {
      if(mousedownIDUP==-1)
      mousedownIDUP = setInterval(whilemousedownUP, 100);
    }
    function mouseupUP(event: any) {
      if(mousedownIDUP!=-1) {
        clearInterval(mousedownIDUP);
        mousedownIDUP=-1;
      }
    }
    function whilemousedownUP() {
      sockeet.emit("move", {key:"ArrowUp", idDuel:idGAME});
    }

    var mousedownIDDOWN:any = -1;
    function mousedownDOWN(event: any) {
      if(mousedownIDDOWN==-1)
      mousedownIDDOWN = setInterval(whilemousedownDOWN, 100);
    }
    function mouseupDOWN(event: any) {
      if(mousedownIDDOWN!=-1) {
        clearInterval(mousedownIDDOWN);
        mousedownIDDOWN=-1;
      }
    }
    function whilemousedownDOWN() {
      sockeet.emit("move", {key:"ArrowDown", idDuel:idGAME});
    }


    /* */


    if (this.$store.state.colorConfig == undefined)
    this.$store.state.colorConfig = 0;

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    if (this.windowWidth >= 1400)
    this.ratio = 1;
    else if (this.windowWidth >= 1200)
    this.ratio = 1.5;
    else if (this.windowWidth >= 800)
    this.ratio = 2;
    else if (this.windowWidth >= 600)
    this.ratio = 2.5;
    else
    this.ratio = 5;

    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      if (this.windowWidth >= 1400)
      this.ratio = 1;
      else if (this.windowWidth >= 1200)
      this.ratio = 1.5;
      else if (this.windowWidth >= 800)
      this.ratio = 2;
      else if (this.windowWidth >= 600)
      this.ratio = 2.5;
      else
      this.ratio = 5;
    });

    const disc = document.getElementById("btn-disconnect");
    disc ? (disc.style.display = "none") : 0;

    /**/
    this.$store.state.socket.on('gameHasBugged', (data: any) => {
      if (this.$store.state.user.id != undefined)
      {
        if (data.idGame == this.gameid)
        {
          this.$store.state.socket.emit("game_won", this.duelid);
          alert('Game finished because one of the players disconnected from the game');
          if (data.idUser ==  this.$store.state.user.id)
          router.push({name: data.page}).catch(() => console.log('Redirection...'));
          else
          router.push({name: 'Profile'}).catch(() => console.log('Redirection...'));
        }
      }
    });
    /**/
    if (this.$route.params.id && this.$store.state.user.id != undefined && (this.$store.state.gameid || this.$store.state.gameid2)) {
      this.duelid = this.$route.params.id;
    }
    else {
      router.push({name: 'Profile'})
    }

    if (this.$store.state.gameid)
    this.gameid = this.$store.state.gameid;
    else
    this.gameid = this.$store.state.gameid2;

    this.$store.state.duelId = this.duelid; //a retirer avant de push spectacte

    let duelLaunch1 = false;
    let duelLaunch2 = false;

    if (this.$store.state.user.id != undefined)
    this.$store.state.socket.emit('connection', {idDuel: this.duelid, validate: this.$store.state.duelId == this.duelid});

    if (this.$store.state.gameid)
    {
      this.nbPoints = this.$store.state.nbPoints;
      axios({
        url: process.env.VUE_APP_API_URL + "/game/launch/" + this.gameid,
        method: "post",
        withCredentials: true,
        data: {
          pointToVictory: this.nbPoints,
          ballSize: 8,
          ballSpeed: 4
        }
      }).then(res => {
        duelLaunch1 = true;
      }).catch(err => {
        console.log("")
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
          this.canvas.width  / this.ratio,
          this.canvas.height  / this.ratio
        );
      }
      this.drawPlayers(this.position[0], this.position[1]);
    });
    /**/

    this.$store.state.socket.on("ball_position", (data: any) => {
      if (this.gameid == data.idDuel)
      {
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
        this.drawBall(data.ball);
        this.drawPlayers(this.position[0], this.position[1]);
      }
    });

    this.$store.state.socket.on("youAre", (side: any) => {
      this.$store.state.side = side;
      this.side = side;
      this.$store.state.socket.on('sendSide', (idOfRoom: any) => {
        if (idOfRoom == idGAME)
        {
          this.$store.state.socket.emit('imAm', {idRoom: idGAME, side:this.side, username: this.$store.state.user.name});
        }
      });

      setTimeout(() => {
        const elementUP = document.getElementById('up');
        elementUP ? elementUP.addEventListener("touchstart", mousedownUP) : 0;
        elementUP ? elementUP.addEventListener("touchend", mouseupUP) : 0;
        elementUP ? elementUP.addEventListener("touchend", mouseupUP) : 0;

        const elementDOWN = document.getElementById('down');
        elementDOWN ? elementDOWN.addEventListener("touchstart", mousedownDOWN) : 0;
        elementDOWN ? elementDOWN.addEventListener("touchend", mouseupDOWN) : 0;
        elementDOWN ? elementDOWN.addEventListener("touchend", mouseupDOWN) : 0;
      }, 300);
    });

    var flagpassage = false;

    this.$store.state.socket.on("update_point", (data: any) => {
      this.$store.state.socket.emit('refreshSpectating');
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
          })
          .then(res => {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].id == this.gameid)
              {
                this.nbPoints = res.data[i].pointToVictory;
                flagpassage = true;
              }
            }
          })
          .catch(() => {
            alert("There was an error, back to profile")
            router.push({name: 'Profile'});
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
          this.$store.state.spec = undefined;

          this.$store.state.socket.emit("game_won", this.duelid);
          if (this.left_point >= this.nbPoints) this.winner = "left";
          else this.winner = "right";
          this.$store.state.socket.emit('refreshUsers', 'all');
          this.$store.state.socket.emit('refreshSpectating');
        }

      }
    });

  },
  methods: {
    drawPlayers: function (player1: any, player2: any) {
      this.context.fillStyle = "#FF4675";
      this.context.fillRect(
        player1.x  / this.ratio,
        player1.y  / this.ratio,
        this.player_size.width  / this.ratio,
        this.player_size.height  / this.ratio
      );
      this.context.fillRect(
        player2.x  / this.ratio,
        player2.y  / this.ratio,
        this.player_size.width  / this.ratio,
        this.player_size.height  / this.ratio
      );
    },
    drawLine: function() {
      this.context.beginPath();
      if (this.context != undefined)
      {
        this.context.moveTo((this.canvas.width / this.ratio) /  2, 0);
        this.context.lineTo((this.canvas.width / this.ratio) / 2, this.canvas.height);
      }
      this.context.strokeStyle = "#fff";
      this.context.stroke();
    },
    drawBall: function(ball: any)
    {
      this.context.beginPath();
      this.context.arc(ball.x  / this.ratio, ball.y  / this.ratio, ball.radius  / this.ratio, 0, 2 * Math.PI);
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

#body {
  overflow-y: hidden;
}

#up, #down {
  outline: none;
  border: 1px solid white;
  background-color: #3043f0;
  padding:1%;
  color:white;
  width:10%;
  cursor:pointer;
}

.blue {
  background-color: #3043f0;
}

.yellow {
  background-color: #c3b70d;
}

.green {
  background-color: #07721e;
}

.violet {
  background-color: #965bf5;
}

h1 , h2 {
  color : black;
}

span {
  color:black;
}

.ending {
  display:flex;
  flex-direction:column;
  align-items:center;
}

.ending button {
  margin-top: 2%;
  background-color: #3043f0;
  width: 200px;
  padding: 1%;
  outline: none;
  cursor:pointer;
  border: 1px solid white;
  border-radius: 5px;
}

.ending button:hover {

  background-color: #1a2ff0;
}

.ended {
  margin-top:3%;
}

h3 {
  color:black;
}
</style>
