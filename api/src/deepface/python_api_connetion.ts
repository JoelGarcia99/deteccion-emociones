import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway(8000, {
  transports: ['websocket'],
})
export class PythonDeepFaceGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect(client: any) {
    this.server.emit('catched!');
  }
  handleConnection(client: any, ...args: any[]) {
    this.server.emit('detection', 'hola, este es el backedm');
  }

  @WebSocketServer() server: any;

  @SubscribeMessage('detection')
  async onDetectionRequest(client: any, payload: any) {
    console.log(payload);
    client.broadcast.emit('detection', payload);
  }
}
