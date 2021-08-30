<template>
    <div class="chat">
    <span> {{dataChat.owner.name }} owner from {{ dataChat.name}}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Chat",
  props: {
    dataChat: {}
  },
  mounted() {
      console.log("OK");
      //console.log(this.dataChat);
  }
});
</script>

<style scoped>
.chat{
    border: 1px solid black;
    width:350px;
}
</style>