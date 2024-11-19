import { Inject, Injectable } from '@nestjs/common';
import {OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, ServerOptions } from 'socket.io';
import { Socket } from 'dgram';
import { WebsocketConfig } from './websocket-config';
import { websocketEvents } from './websocket.events';

@Injectable()
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit {
  constructor(@Inject('CONFIG_OPTIONS') private options: WebsocketConfig) {}

  @WebSocketServer() server: Server;

  async afterInit(server: Server, options?: ServerOptions): Promise<void> {
    console.log(`[WebsocketGateway] Websocket started on port: ${this.options.port}`);
    return;
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log('[WebsocketGateway] Client disconnected: ', client['handshake'].headers.origin);
  }

  async handleConnection(client: Socket): Promise<void> {
    console.log('[WebsocketGateway] Client connected: ', client['handshake'].headers.origin);
  }

  async notifyWebsockets(wsEvent: string, verbose: boolean = false): Promise<boolean> {
    if (!this.validateWebsocketEvent(wsEvent)) {
      console.log(`[notifyWebsockets] Event '${wsEvent}' is not a valid event`);
      return false;
    }

    if (!this.sendWebsocketNotification(wsEvent)) {
      console.log(`[notifyWebsockets] Event '${wsEvent}' unnable to send notification`);
      return false;
    }

    if (verbose) console.log(`[notifyWebsockets] Event '${wsEvent}' notification sended`);
    return true;
  }

  private sendWebsocketNotification(wsEvent: string): boolean {
    try {
      this.server.emit(wsEvent, true);
      return true;
    } catch (err) {
      console.error(`[sendWebsocketNotification] Error: ${JSON.stringify(err)}`);
      return false;
    }
  }

  private validateWebsocketEvent(wsEvent: string): boolean {
    let validEvent: boolean = false;

    for (const event of Object.values(websocketEvents)) {
      if (event == wsEvent) {
        validEvent = true;
        break;
      }
    }

    return validEvent;
  }
}
