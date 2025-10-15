import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ConfigService } from '@nestjs/config';
import fastifyMultipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fastifyCookie from '@fastify/cookie';

const bootstrap = async () => {
  const config = new ConfigService();
  const PORT: number = config.get('PORT') ?? 5000;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 1024 * 1024 * 50,
      maxParamLength: 500,
      logger: true,
    }),
  );

  await app.register(fastifyCookie, {
    secret: config.get('COOKIE_SECRET') as string,
  });

  app.enableCors({
    origin: ['http://10.219.210.237', 'http://localhost'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 30 * 1024 * 1024,
      files: 1,
    },
  });

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onError', (request, reply, error, done) => {
      console.error(`Erreur lors de la requête ${request.url}:`, error);
      done();
    });

  await app.listen(PORT, '0.0.0.0');

  console.log(`Server running on http://localhost:${PORT}`);
};
void bootstrap();
