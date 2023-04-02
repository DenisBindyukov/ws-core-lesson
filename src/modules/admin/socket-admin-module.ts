import { Module } from '@nestjs/common';
import {SocketAdminService} from "./socket-admin.service";

@Module({
    imports: [],
    controllers: [],
    providers: [SocketAdminService],
})
export class SocketAdminModule {}
