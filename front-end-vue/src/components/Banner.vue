<template>
  <div id="body">
    <div id="left">
      <img id="avatar" :src="getPath(user.avatar)" alt="avatar" />
      <template v-if="is_auth">
        <input
          type="file"
          accept="image/*"
          value="..."
          style="display:none;"
          @change="fileSelected"
          ref="fileInput"
        />
        <button id="btn-image" @click="$refs.fileInput.click()">...</button>
      </template>
    </div>
    <div id="right">
      <div id="top">
        <span>{{user.name}}</span>
        <span>{{user.email}}</span>
      </div>
      <div id="bottom">
        <span v-if="user.xp">{{user.xp}}xp</span>
        <span v-else>0xp</span>
        <span>rank : {{user.level}}</span>
        <span>{{user.nWins}}W / {{user.nLosses}}L</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  name: "Banner",
  props: ['id'],
  data() {
    return {
      user: null,
      is_auth: false
    };
  },
  methods: {
    getPath(avatar: any) {
      avatar = avatar.substring(10);
      return "/assets/" + avatar;
    }
  },
  mounted() {
    if (this.id == this.$store.state.user.id)
      this.is_auth = true;
    axios({
      url: `${ process.env.VUE_APP_API_URL }/user/` + this.id,
      method: "get",
      withCredentials: true,
    }).then(res => {
      this.user = res.data;
    });
  }
});
</script>

<style scoped>
#body {
  background-color: #3040F0;
  display: flex;
  width: 65vw;
  height: 30%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  color: white;
}

/* LEFT */

#left {
  position: relative;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

#avatar {
  border-radius: 100%;
  width: 142px;
  height: 142px;
}

#btn-image {
  position: absolute;
  bottom: 18%;
  right: 18%;
  border-radius: 100%;
  cursor: pointer;
  outline: none;
}

/* RIGHT */

#right {
  flex: 8;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

#top,
#bottom {
  height: 35%;
  width: 80%;
  background-color: rgb(8, 19, 136);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 15px;
}

/* */
</style>
