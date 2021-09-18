<template>
  <div class="profile">
    <template v-if="is_auth">
      <button id="settings" class="button" @click="showModal = true">2 FactorAuth</button>
      <transition name="fade" appear>
        <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
      </transition>
      <transition name="slide">
        <div class="modal" v-if="showModal">

          <template v-if="$store.state.user.isTwoFactorAuthenticationEnabled == false">
            <button v-bind:disabled="is_generating" @click="generate" class="btn">Generate</button>
            <span v-if="loading != '' && QRCodeSRC == ''">{{ loading }}</span>
            <img v-if="QRCodeSRC != ''" :src="QRCodeSRC" alt="qr" />
          </template>

          <template v-if="$store.state.user.isTwoFactorAuthenticationEnabled == false">
            <input v-if="QRCodeSRC != ''" type="text" required v-model="turnOnCode" placeholder="??????" />
            <button v-if="QRCodeSRC != ''" v-bind:disabled="is_turning_on" class="btn" @click="turnOn">Enable</button>
          </template>
          <template v-else>
            <span> Your double factor authentication is enabled. </span>
            <button class="btn" v-bind:disabled="is_turning_off" @click="turnOff">Disable</button>
          </template>
          <span v-if="errorQRCode != ''" class="error">{{ errorQRCode }}</span>
        </div>
      </transition>
    </template>
    <div class="content" v-bind:class="{ 'content-self': is_auth }">
      <Banner v-if="user" :id="user.id" />
      <div id="bottom">
        <div id="left">
          <MenuFriends v-if="render" :id="user.id" />
          <MenuBlocks v-if="is_auth" />
        </div>
        <div id="middle">
          <button id="play" v-if="is_auth">PLAY</button>
        </div>
        <div id="right">
          <MenuMatchesHistory />
          <!--<MenuDuels v-if="is_auth" />-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */

import Vue from "vue";
import Store from "../store";
import router from "../router";
import axios from "axios";

import Banner from "../components/Banner.vue";
import MenuFriends from "../components/MenuFriends.vue";
import MenuBlocks from "../components/MenuBlocks.vue";
import MenuMatchesHistory from "../components/MenuMatchesHistory.vue";
import MenuDuels from "../components/MenuDuels.vue";

export default Vue.extend({
  name: "Profile",
  store: Store,
  components: {
    Banner: Banner,
    MenuFriends: MenuFriends,
    MenuBlocks: MenuBlocks,
    MenuMatchesHistory: MenuMatchesHistory,
    MenuDuels: MenuDuels
  },
  data() {
    return {
      selectedFile: null,
      user: {},
      data: {},
      is_auth: false,
      loading: "",
      QRCodeSRC: "",
      errorQRCode: "",
      showModal: false,
      is_generating: false,
      turnOnCode: "",
      is_turning_on: false,
      turnOffCode: "",
      is_turning_off: false,
      render: false as any,
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.checkAuth(this.$route.params.id);
      if (this.$route.params.id == this.$store.state.user.id) {
        this.is_auth = true;
      }
    } else {
      this.user = this.$store.state.user;
      this.is_auth = true;
    }
    this.render = true;
  },
  methods: {
    checkAuth(id: string) {
      const url = `${process.env.VUE_APP_API_URL}/user/` + id;
      axios({
        url: url,
        method: "get",
        withCredentials: true
      })
      .then(res => {
        this.user = res.data;
      })
      .catch(() => {
        router.push({ path: "/profile" });
      });
    },
    async generate() {
      this.QRCodeSRC = "";
      this.loading = "Loading...";
      this.is_generating = true;
      let response;
      try {
        response = await fetch(
          `${process.env.VUE_APP_API_URL}/2fa/generate`,
          {
            method: "POST",
            credentials: "include"
          }
        );
      }
      catch {
        console.log("err while generate qrcode");
      }
      try {
        if (response) {
          this.QRCodeSRC = URL.createObjectURL(await response.blob());
        }
      }
      catch {
        console.log("err while blobing qr code");
      }
      this.is_generating = false;
    },
    turnOn() {
      this.is_turning_on = true;
      this.errorQRCode = "";
      axios({
        url: `${process.env.VUE_APP_API_URL}/2fa/turn-on/`,
        method: "post",
        data: {
          twoFactorAuthenticationCode: this.turnOnCode
        },
        withCredentials: true
      })
      .then(() => {
        this.$store.state.user.isTwoFactorAuthenticationEnabled = true;
        this.turnOnCode = "";
        this.showModal = false;
      })
      .catch(() => {
        this.errorQRCode = "Wrong code entered";
      });
      this.is_turning_on = false;
    },
    turnOff() {
      this.is_turning_off = true;
      this.errorQRCode = "";
      axios({
        url: `${process.env.VUE_APP_API_URL}/2fa/turn-off/`,
        method: "post",
        withCredentials: true
      })
      .then(() => {
        console.log("spotify");
        this.showModal = false;
        this.$store.state.user.isTwoFactorAuthenticationEnabled = false;
      }).catch(err => {
        console.log(err);
      })
      this.is_turning_off = false;
    }
  }
});
</script>

<style scoped>
/* AUTH */

#settings {
  margin: 20px;
}

input {
  padding: 5px;
  border: 1px solid black;
  height: 45px;
  text-align:center;
}

.btn {
  color: white;
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: border-radius 0.4s ease-in-out;
  background-image: linear-gradient(to right, #3040F0, #3040F0);
  font-weight: 700;
  font-size: 15px;
}

.btn:hover {
  background-image: linear-gradient(to right, #3040F0, #002566);
  border-radius: 12px;

}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.error {
  color: red;
}

.button {
  color: white;
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-block;
  padding: 8px 18px;
  background-image: linear-gradient(to right, #3040F0, rgb(9, 68, 170));
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;

  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;
}

.button:hover {
  box-shadow: 1px 1px rgba(0, 0, 0, 0.6);
}

.modal-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;

  width: 100%;
  max-width: 400px;
  min-height: 45%;
  background-color: #fff;
  border-radius: 16px;

  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.modal button {
  width: 170px;
  height: 55px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* */

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 91.9vh;
  background-color: rgb(250, 99, 137);
  position: relative;
  width: 100%;
  align-items: center;
  overflow-x: hidden;
}

.content {
  margin: auto;
  width: 85%;
  height: 85%;
  max-width: 1000px;
}

.content-self {
  margin: auto;
  margin-top: 0;
}

/* new css */

#play {
  background-color: red;
  border-radius: 25px;
  border: 3px solid black;
  width: 42%;
  height: 27%;
  font-size: 50px;
  outline: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

#play:hover {
  background-color: rgb(228, 0, 0);
}

#bottom {
  display: flex;
  background-color: #ebebeb;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  height: 70%;
  width: 100%;
}

#left,
#right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 30%;
  align-items: center;
}

#middle {
  width: 40%;
  height: 100%;
  background-color: #ebebeb;
  display:flex;
  justify-content: center;
  align-items:center;
}

/* */
</style>
