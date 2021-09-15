import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets"
import { Socket } from "socket.io"

@WebSocketGateway({cors: true})
export class DuelGateway {
    @WebSocketServer()
    server;

    //subscribe message server.on
    @SubscribeMessage('duelSent')
    duelSent(client:Socket, data: {idRoom: string, id: string}) {
        this.server.emit('refreshChannels', data.id);
    }

    @SubscribeMessage('duelDenied')
    duelDenied(client:Socket, data: {idRoom: string, id: string}) {
        this.server.emit('refreshDuels', data.id);
    }

    @SubscribeMessage('duelAccepted')
    duelAccepted(client:Socket, data: {idRoom: string, id: string, duelId: string}) {
        console.log("duel recu, go server emit");
        this.server.emit('duelIsAccepted', data);
    }

}