<template>
  <div class="profile">
    <Banner :id="user.id"/>
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
        <MenuMatchesHistory/>
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

import Banner from "../components/Banner.vue"
import MenuFriends from "../components/MenuFriends.vue"
import MenuBlocks from "../components/MenuBlocks.vue"
import MenuMatchesHistory from "../components/MenuMatchesHistory.vue"
import MenuDuels from "../components/MenuDuels.vue"

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
      is_auth: false
    };
  },
  mounted() {

    if (this.$route.params.id)
    {
      this.checkAuth(this.$route.params.id);
      if (this.$route.params.id == this.$store.state.user.id)
        this.is_auth = true;
    }
    else
    {
      this.user = this.$store.state.user;
      this.is_auth = true;
    }
  },
  methods: {
    getPath(avatar: any) {
      avatar = avatar.substring(10);
      return "/assets/" + avatar;
    },
    checkAuth(id: string) {
      const url = `${ process.env.VUE_APP_API_URL }/user/` + id;
      axios({
        url: url,
        method: "get",
        withCredentials: true,
        headers: {
            "Access-Control-Allow-Origin": `${ process.env.VUE_APP_API_URL }`
        }
      }).then(res => {
        this.user = res.data;
      }).catch(() => {
        router.push({path: '/profile'});
      });
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

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80vh;
  width:100%;
}

/* new css */

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

#bottom {
  display:flex;
  background-color: #ebebeb;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  height: 70%;
  width: 65%;
}

#left, #right {
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 30%;
  align-items:center;
}

#middle {
  width: 40%;
  height:100%;
  background-color: #ebebeb;
}


/* */

</style>
