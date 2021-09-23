import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {

  handleConnection(client: Socket, ...args: any[]) {
    console.log("handleConnection");
    // console.log(client);
    console.log(args);
  }

  handleDisconnect(client: Socket) {
    console.log("handleDisconnect");
    // console.log(client);
  }

  @SubscribeMessage('blabla')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
