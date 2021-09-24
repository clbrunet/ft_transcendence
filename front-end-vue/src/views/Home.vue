<template>
  <div class="home">
    <div class="pongGame">
      <div class="content">
        <h1>Test your skills at the first sport arcade game</h1>
        <button @click="goToRegister()">Sign up for free</button>
      </div>
      <div class="ball">
      </div>
      <div class="bar1">
      </div>
      <div class="bar2">
      </div>
      <div class="dotted-line">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',
  methods: {
    goToRegister() {
      this.$router.push({name: 'Register'});
    }
  },
})
</script>

<style scoped>
.home {
  width: 100%;
  height: 91vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ball {
  position:absolute;
  width: 40px;
  height: 40px;
  background-color:white;
  border-radius: 100%;
  box-shadow: 3px 0 1px 0px #aaa;
  top: 56%;
  right: 12%;
}

.bar1, .bar2 {
  position:absolute;
  width: 1.5%;
  height: 21%;
  background-color:#ff4675;
  box-shadow: 8px 0 1px 0px #ef2356;
}

.bar1 {
  left: 5%;
  top: 10%;
}

.bar2 {
  right: 5%;
  bottom:17%;
}

.pongGame {
  background-color:#3040F0;
  width: 75%;
  height: 75%;
  border: 21px solid white;
  position: relative;
  margin: auto;
  display: flex;
  align-items:center;
  justify-content: center;
}

.dotted-line {
  z-index: 100;
  position: absolute;
  left: 49.75%;
  height: 100%;
  width: 0.5%;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
}

.dot {
  background-color: rgba(255, 255, 255, 0.59);
  height: 13%;
  width: 100%;
}

.content {
  width: 100%;
  height: 100%;
  padding: 21px;
  position: absolute;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  color: white;
  margin-bottom: 25px;
}

button {
  margin-top: 25px;
  text-align: center;
  width: fit-content;
  padding: 15px;
  cursor:pointer;
  background-color: #7583FF;
  border-radius:8px;
  border: 2px solid white;
  color:white;
  font-weight: 700;
  font-size:20px;
}

button:hover {
  background-color: rgb(87, 104, 250);
}
</style>
