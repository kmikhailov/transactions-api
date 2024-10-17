import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Mock Transactions API')
    .setDescription('API for managing mock transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // Swagger UI will be available at /api

  await app.listen(3001);
  console.log('Mock transactions server is running on http://localhost:3001');
  console.log('Swagger documentation available at http://localhost:3001/api');
}

bootstrap();
