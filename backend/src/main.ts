import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS configuration - Allow frontend localhost:3000
  app.enableCors({
    origin: [envConfig.CORS_ORIGIN, 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // API prefix
  const globalPrefix = envConfig.API_GLOBAL_PREFIX;
  app.setGlobalPrefix(globalPrefix);

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Exchanger API')
    .setDescription('The Exchanger API documentation')
    .setVersion('1.0')
    .addTag('currency')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(envConfig.SWAGGER_PATH, app, document);

  // Start the server
  const port = envConfig.PORT;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/${envConfig.SWAGGER_PATH}`);
  console.log(`CORS enabled for: ${envConfig.CORS_ORIGIN}`);
  console.log(`API Key configured: ${envConfig.EXCHANGERATE_API_KEY ? 'Yes' : 'No'}`);
}

bootstrap();
