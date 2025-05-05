import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import * as express from 'express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('PaymentsMS');
  const app = await NestFactory.create(AppModule,{rawBody:true});

  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  // Esto puede ir después para otras rutas
  app.use(express.json());

  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

  await app.listen(envs.port);
  logger.log(`Payments microservice is running on port ${envs.port}`);

}
bootstrap();
