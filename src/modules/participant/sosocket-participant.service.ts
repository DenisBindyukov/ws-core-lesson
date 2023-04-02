import {Server, Socket,} from "socket.io";
import {WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets"


@WebSocketGateway(
    {
        cors: {
            origin: "*"
        },
        namespace: "participant"
    }
)


export class SocketParticipantService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private clients: Map<Socket, string> = new Map();

    authenticationParticipant(data: { participantId: string, status: string }) {
        for (const [savedClient, participantId] of this.clients) {
            if (participantId === data.participantId) {
                savedClient.emit("auth", {status: data.status})
            }
        }
    }

    sendStatusQuiz(data: { quizId: string, status: boolean }) {
        this.server.to(`room_${data.quizId}`).emit("quiz-public", {
            type: "QUIZ-STATUS",
            payload: {
                status: data.status
            }
        })
    }


    handleConnection(client: Socket) {
        const roomKey = client.handshake.headers.roomkey;
        const participantId = client.handshake.headers.participantid as string;

        this.clients.set(client, participantId);
        client.join(`room_${roomKey}`)
    }

    handleDisconnect(client: Socket) {
      for (const [savedClient, participantId] of this.clients) {
          if (savedClient === client) {
              this.clients.delete(savedClient)
          }
      }
    }

}
