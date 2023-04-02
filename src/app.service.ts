import {Injectable} from '@nestjs/common';
import {SocketParticipantService} from "./modules/participant/sosocket-participant.service";

@Injectable()
export class AppService {
    constructor(
        private readonly participantService: SocketParticipantService
    ) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    validateParticipants(dto: { participantId: string, status: string }) {
        this.participantService.authenticationParticipant(dto)
        return
    }

    sendStatusQuiz(dto: {
        quizId: string,
        status: boolean
    }) {
        this.participantService.sendStatusQuiz(dto)
        return
    }
}
