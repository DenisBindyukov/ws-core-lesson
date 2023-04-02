import { UseFilters, UseGuards, UsePipes} from '@nestjs/common';
import {Socket} from "socket.io";
import {WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WsException, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer} from "@nestjs/websockets"
import {AdminDtoType} from "./types/types";
import {WsValidationPipe} from "../../pipes/validation-ws";
import {WsExceptionFilter} from "../../exteptions-filter/ws-exception-filter";
import {SocketAuthTokenGuard} from "../../guards/socket-auth-token-guard";


@WebSocketGateway(
    {
        cors: {
            origin: "*"
        },
        namespace: "admin"
    }
)


export class SocketAdminService implements OnGatewayConnection, OnGatewayDisconnect {

    @UseGuards(SocketAuthTokenGuard)
    @UsePipes(WsValidationPipe)
    @UseFilters(WsExceptionFilter)
    @SubscribeMessage("admin-path")
    handleEvent(@MessageBody() dto: AdminDtoType, @ConnectedSocket() client: Socket) {
       // const res = this.someService(dto)
        const res = {type: "someEvents", dto};
        client.emit("admin-path",res)
    }

    handleConnection(client: Socket) {
        const token = client.handshake.headers.token as string
        const roomKey = client.handshake.headers.roomkey

        if (!token) {
            this.forceDisconnect(client, 'Token is missing')
        }

        if (token) {
           // const result  = //await some service(token)
            const result = token === '123'
            if (!result) {
                this.forceDisconnect(client, "Unauthorized")
                return
            }
        }

        client.join(`room_${roomKey}`)
    }

    forceDisconnect(client: Socket, message: string) {
        client.emit('401', new WsException(message))
        client.disconnect(true)
    }

    handleDisconnect(client: Socket) {
    }

}
