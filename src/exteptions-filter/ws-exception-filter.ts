import { BaseWsExceptionFilter } from "@nestjs/websockets";
import {ArgumentsHost, Catch} from "@nestjs/common";


@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToWs();
        const client = ctx.getClient();

        client.emit({
            type: exception.name,
            timestamp: new Date().toISOString(),
            message: exception.getError()
        })
    }
}