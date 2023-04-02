import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SocketParticipantModule} from "./modules/participant/socket-participant-module";
import {SocketAdminModule} from "./modules/admin/socket-admin-module";
import {SocketAdminService} from "./modules/admin/socket-admin.service";
import {SocketParticipantService} from "./modules/participant/sosocket-participant.service";


@Module({
    imports: [SocketAdminModule, SocketParticipantModule],
    controllers: [AppController],
    providers: [AppService, SocketAdminService, SocketParticipantService],
})
export class AppModule {
}
