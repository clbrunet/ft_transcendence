module.exports = function (server_socket, client_socket, players) {

    client_socket.on("join_chats", data => {
        const user = {
            username: data.name,
            id: client_socket.id
        }
        players.push(user);
        console.log(user.username , " added, Nb players = ", players.length);
    });
}