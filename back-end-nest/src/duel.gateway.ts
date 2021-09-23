import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets"
import { Socket } from "socket.io"

@WebSocketGateway({cors: true})
export class DuelGateway {
    @WebSocketServer()
    server;

    @SubscribeMessage('duelSent')
    duelSent(client:Socket, data: {idRoom: string, id: string}) {
        this.server.emit('refreshChannels', data.id);
    }

    @SubscribeMessage('duelDenied')
    duelDenied(client:Socket, data: {idRoom: string, id: string}) {
        this.server.emit('refreshDuels', data.id);
    }

    @SubscribeMessage('duelAccepted')
    duelAccepted(client:Socket, data: {idRoom: string, id: string, ownerId: string, duelId: string}) {
        this.server.emit('duelIsAccepted', data);
    }

    @SubscribeMessage('gameBugged')
    gameBugged(client:Socket, data: {idGame: string, page: string, idUser: string}) {
        this.server.to(data.idGame).emit('gameHasBugged', data);
    }

    @SubscribeMessage('refreshUsers')
    refreshFriends(client:Socket, idUser: string) {
        this.server.emit('refreshAllUsers', idUser);
    }

    @SubscribeMessage('refreshSpectating')
    refreshSpectating(client:Socket) {
        this.server.emit('refreshAllSpectates');
    }

    @SubscribeMessage('refreshChannels')
    refreshChannels(client: Socket) {
        this.server.emit('refreshAllChannels');
    }

    @SubscribeMessage('refreshChat')
    refreshChat(client: Socket, idRoom: string) {
        this.server.emit('refreshOnceChat', idRoom);
    }
}