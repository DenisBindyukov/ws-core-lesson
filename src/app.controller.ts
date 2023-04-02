import {Body, Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService
    ) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('validate-participants')
    validateParticipants(@Body() dto: { participantId: string, status: string }) {
       this.appService.validateParticipants(dto)
        return true
    }

    @Post('quiz-management')
    sendStatus(@Body() dto: {
        quizId: string,
        status: boolean
    }) {
        this.appService.sendStatusQuiz(dto)
        return true
    }
}
