import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets"
import { Socket } from "socket.io"

@WebSocketGateway({cors: true})
export class ChatGateway {
    @WebSocketServer()
    server;

    @SubscribeMessage('chatToServer')
    handleMessage(client:Socket, message: {sender: string, room: string, message: string}) {
        this.server.to(message.room).emit('chatToClient', message);
    }

    @SubscribeMessage('dmToServer')
    handleDM(client:Socket, message: {sender: string, room: string, message: string}) {
        this.server.to(message.room).emit('chatToDm', message);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        console.log("id de la room joined = ", room);
        client.join(room);
        client.emit('joinedRoom', room);
    }
}