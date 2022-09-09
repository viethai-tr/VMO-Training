import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    const configService = app.get(ConfigService);

    const config = new DocumentBuilder()
        .setTitle('Project Management - NestJS + MongoDB')
        .setDescription('API description')
        .setVersion('1.0')
        .addTag('Project Management')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get('port'));
}
bootstrap();
