import {CanActivate, ExecutionContext} from "@nestjs/common";
import {Socket} from "socket.io";
import {WsException} from "@nestjs/websockets";


export class SocketAuthTokenGuard implements CanActivate {
    constructor(private someService: any) {
    }

    async canActivate(context: ExecutionContext) {
        const client: Socket = context.switchToWs().getClient();
        const token = client.handshake.headers.token as string;

        if (!token) {
         throw new WsException(" Token is missing")
        }

        if (token) {
            // const result  = //await some service(token)
            const result = token === '123'
            if (!result) {
                throw new WsException("Unauthorized")
            }
        }

        return true
    }
}