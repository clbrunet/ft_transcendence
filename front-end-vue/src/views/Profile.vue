<template>
  <div class="profile" id="body">
    <button id="settings" class="button" @click="showModal = true">Settings</button>
    <transition name="fade" appear>
      <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
    </transition>
    <transition name="slide">
      <div class="modal" v-if="showModal">

        <template v-if="$store.state.user.isTwoFactorAuthenticationEnabled == false">
          <button @click="generate" class="btn">Generate</button>
          <span v-if="loading != '' && QRCodeSRC == ''">{{ loading }}</span>
          <img v-if="QRCodeSRC != ''" :src="QRCodeSRC" alt="qr" />
        </template>

        <template v-if="$store.state.user.isTwoFactorAuthenticationEnabled == false">
            <input v-if="QRCodeSRC != ''" type="text" v-model="turnOnCode" placeholder="??????" />
            <button v-if="QRCodeSRC != ''" class="btn" @click="turnOn">Enable</button>
        </template>
        <template v-else>
            <span> Your double factor authentication is enabled. </span>
            <button class="btn" @click="turnOff">Disable</button>
        </template>
        <span v-if="errorQRCode != ''" class="error">{{ errorQRCode }}</span>
      </div>
    </transition>
    <Banner :id="user.id" />
    <div id="bottom">
      <div id="left">
        <MenuFriends :id="user.id" />
        <MenuBlocks v-if="is_auth" />
      </div>
      <div id="middle">
        game WIP
        <button id="play">PLAY</button>
      </div>
      <div id="right">
        <MenuMatchesHistory />
        <MenuDuels v-if="is_auth" />
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
import DoubleFactorAuthentication from "../components/DoubleFactorAuthentication.vue";

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
      user: null,
      data: {},
      is_auth: false,
      loading: "",
      QRCodeSRC: "",
      errorQRCode: "",
      showModal: false,
      turnOnCode: "",
      turnOffCode: ""
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.checkAuth(this.$route.params.id);
      if (this.$route.params.id == this.$store.state.user.id)
        this.is_auth = true;
    } else {
      this.user = this.$store.state.user;
      this.is_auth = true;
    }
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
        if (response)
          this.QRCodeSRC = URL.createObjectURL(await response.blob());
      }
      catch {
        console.log("err while blobing qr code");
      }
    },
    turnOn() {
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
          axios({
            url: `${process.env.VUE_APP_API_URL}/2fa/authenticate/`,
            method: "post",
            data: {
              twoFactorAuthenticationCode: this.turnOnCode
            },
            withCredentials: true
          })
            .then(() => {
              this.turnOnCode = "";
              this.showModal = false;
            })
            .catch(() => {
              this.$store.state.expired =
                "You turned it on, but your code has expired when trying to authenticate";
              router.push({ name: "Auth" });
            });
        })
        .catch(() => {
          this.errorQRCode = "Wrong code entered";
        });
    },
    turnOff() {
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
    }
    /*,
    fileSelected(event) {
      this.selectedFile = event.target.files[0];
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      console.log(fd);
      console.log(this.selectedFile);
    }*/
  }
});
</script>

<style scoped>
/* AUTH */

#settings {
  margin-bottom: 1%;
  margin-top: 2%;
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
  background-image: linear-gradient(to right, #0758da, #0758da);
  font-weight: 700;
  font-size: 15px;
}

.btn:hover {
  background-image: linear-gradient(to right, #00286e, #002566);
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
  background-image: linear-gradient(to right, #00286e, #002566);
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

body {
  height: 100vh;
}

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 91.5vh;
  width: 100%;

  position: relative;

  justify-content: center;
  align-items: center;

  width: 100vw;
  overflow-x: hidden;
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
  width: 65%;
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
}

/* */
</style>
