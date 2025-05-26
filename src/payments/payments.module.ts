import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NatsModule } from 'src/nats/nats.module';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, EmailService],
  imports: [NatsModule]
})
export class PaymentsModule {}
