<template>
    <div id="body">
        <h1>List of users available !</h1>
        <table>
            <tr v-for="(user, index) in users" :key="index">
                <template v-if="user.id != $store.state.user.id">
                    <td class="field"> {{user.name}} </td>
                    <td class="field"> {{user.level}} </td>
                    <td class="field"> {{user.xp}} xp </td>
                    <td class="field"> {{user.nWins}}W / {{user.nLosses}}L </td>
                    <template v-if="is_blocked(user)">
                        <td class="field">
                            Blocked
                        </td>
                        <td class="field">
                            Blocked
                        </td>
                        <td class="field">
                            Blocked
                        </td>
                        <td class="field btnBox">
                            <button class="field btn" @click="unblock(user)"> Unblock </button>
                        </td>
                    </template>
                    <template v-else-if="friends">
                        <td class="field btnBox">
                            <button class="field btn" @click="duel(user)"> Duel </button>
                        </td>
                        <td class="field btnBox">
                            <button class="field btn" @click="send_message(user)"> Send DM </button>
                        </td>
                        <td class="field btnBox">
                            <template v-if="tab[index] == 'received'">
                                <button class="field btn" @click="accept_friend_request(user)"> V </button>
                                <button class="field btn" @click="deny_friend_request(user, tab, index)"> X </button>
                            </template>
                            <span class="field" v-else-if="tab[index] == 'sent'"> Sent</span>
                            <button class="field btn" v-else-if="tab[index] == 'accepted'" @click="remove_friend(user)"> Remove friend</button>
                            <button class="field btn" v-else @click="add_friend(user)"> Add Friend </button>
                        </td>
                        <td class="field btnBox">
                            <button class="field btn" @click="block(user)"> Block </button>
                        </td>
                    </template>
                </template>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import router from '../router'
export default Vue.extend({
    name: 'Users',
    data() {
        return {
            users: {},
            blocks: {},
            friends: {},
            tab: []
        }
    },
    mounted() {
        this.get_users();
        this.get_blocks();
    },
    methods: {
        get_users() {
            axios({
                url: `${ process.env.VUE_APP_API_URL }/user/index`,
                method: "get",
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": `${ process.env.VUE_APP_API_URL }`
                }
            }).then(res => {
                this.users = res.data;
                this.get_friends();
            });
        },
        get_blocks() {
            axios({
                url: `${ process.env.VUE_APP_API_URL }/block/index`,
                method: "get",
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": `${ process.env.VUE_APP_API_URL }`
                }
            }).then(res => {
                this.blocks = res.data;
            });
        },
        get_friends() {
            axios({
                url: `${ process.env.VUE_APP_API_URL }/friend/index`,
                method: "get",
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": `${ process.env.VUE_APP_API_URL }`
                }
            }).then(res => {
                this.friends = res.data;
                this.tab.length = 0;
                for (let i = 0; i < this.users.length; i++)
                {
                    var flag = false;
                    for (let j = 0; j < this.friends.length; j++)
                    {
                        if (this.users[i].id == this.friends[j][0].friendId)
                        {
                            this.tab.push(this.friends[j][0].requestStatus);
                            flag = true;
                        }
                    }
                    if (flag == false)
                        this.tab.push('none');
                }
            });
        },
        is_blocked(user: any) {
            if (this.blocks)
            {
                for (let i = 0; i < this.blocks.length; i++)
                {
                    if (user.id == this.blocks[i].blockId)
                     return (true);
                }
            }
            return (false);
        },
        duel (user: any) {
            alert('you sent a duel to ' + user.name + ' as ' + this.$store.state.user.name);
        },
        add_friend (user: any) {

            const url = `${ process.env.VUE_APP_API_URL }/friend/` + user.id;
            axios({
                url: url,
                method: "post",
                headers: {
                    'Access-Control-Allow-Origin': `${ process.env.VUE_APP_API_URL }`
                },
                withCredentials: true
            }).then(() => {
                this.get_users();
            });
        },
        remove_friend (user: any) {
            const url = `${ process.env.VUE_APP_API_URL }/friend/unfriend/` + user.id;
            axios({
                url: url,
                method: "delete",
                headers: {
                    'Access-Control-Allow-Origin': `${ process.env.VUE_APP_API_URL }`
                },
                withCredentials: true
            }).then(() => {
                this.get_users();
            });
        },
        accept_friend_request(user: any) {
            const url = `${ process.env.VUE_APP_API_URL }/friend/accept/` + user.id;
            axios({
                url: url,
                method: "patch",
                headers: {
                    'Access-Control-Allow-Origin': `${ process.env.VUE_APP_API_URL }`
                },
                withCredentials: true
            }).then(() => {
                this.get_users();
            });
        },
        deny_friend_request(user: any) {
            const url = `${ process.env.VUE_APP_API_URL }/friend/reject/` + user.id;
            axios({
                url: url,
                method: "patch",
                headers: {
                    'Access-Control-Allow-Origin': `${ process.env.VUE_APP_API_URL }`
                },
                withCredentials: true
            }).then(() => {
                this.get_users();
            });
        },
        block(user: any) {
            alert(this.$store.state.user.name + ' wants to block ' + user.name);
        },
        unblock(user: any) {
            alert(this.$store.state.user.name + ' wants to unblock ' + user.name);
        },
        send_message(user: any) {
            alert(this.$store.state.user.name + ' wants to send a message to ' + user.name);
        }
    }
})
</script>

<style scoped>

#body{
    display:flex;
    align-items:center;
    justify-content:center;
    margin-top:6%;
    flex-direction:column;
}

table {
    border: 1px solid black;
    padding: 1%;
}
td {
    text-align:left;
    margin:0px;
    overflow:hidden;
}
tr:nth-child(even) {
    border: 1px solid black;
    background-color: #ededed;
}
tr {
    margin:0px;
}

.field {
    padding:5px 15px 5px 15px;
}

.btn {
    cursor:pointer;
    height:100%;
    margin-left:auto;
}
</style>
