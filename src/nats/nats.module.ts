import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE } from 'src/config';


@Module({
    imports: [
        ClientsModule.register([{ name: NATS_SERVICE, transport: Transport.NATS, options: { servers: envs.nasts_servers } }]),
    ],
    exports: [
        ClientsModule.register([{ name: NATS_SERVICE, transport: Transport.NATS, options: { servers: envs.nasts_servers } }]),
    ]
})
export class NatsModule { }
