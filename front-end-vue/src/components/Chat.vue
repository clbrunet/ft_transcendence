<template>
  <div class="chat">
    <span class="title" v-if="data.name"> {{data.name}} by {{data.owner.name }}</span>
    <div class="messages">
      <p>bla bla messages simulés</p>
      <p>bla bla blaaaaaa</p>
      <p>bla bla blooo msg simulés</p>
      <p>bli blou bla bla blop</p>
    </div>
    <div class="buttons">
      <input class="message" type="text" placeholder="type your message here">
      <input class="send" type="submit" value="send">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Chat",
  props: {
    data: {}
  },
  mounted() {
    console.log(this.$props.data);
  }
});
</script>

<style scoped>
.chat{
  display:flex;
  border: 1px solid black;
  width:350px;
  flex-direction:column;
  position:relative;
}

.title {
  color:white;
  background-color:black;
  padding:15px;
}

.buttons{
  display:flex;
  position:absolute;
  bottom:0;
  width:100%;
}

.message {
  flex:3;
}

.send{
  flex:1;
}
</style>