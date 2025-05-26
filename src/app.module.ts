import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { EmailService } from './email/email.service';


@Module({
  imports: [PaymentsModule],
  exports: [EmailService],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
