import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // API prefix
  const globalPrefix = configService.get('API_GLOBAL_PREFIX', 'api');
  app.setGlobalPrefix(globalPrefix);

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Exchanger API')
    .setDescription('The Exchanger API documentation')
    .setVersion('1.0')
    .addTag('currency')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('SWAGGER_PATH', 'docs'), app, document);

  // Start the server
  const port = configService.get('PORT', 3001);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/${configService.get('SWAGGER_PATH', 'docs')}`);
}

bootstrap();
