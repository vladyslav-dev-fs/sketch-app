import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Sketch App API')
    .setDescription(
      'Sketch App API provides public and private endpoints.\n\n' +
        'Roles:\n' +
        '- Admin: full access to the system\n' +
        '- User: basic account-related operations\n\n' +
        'All requests return standard HTTP status codes and JSON responses.',
    )
    .setVersion('1.0.0')
    .addTag('Users', 'User-related operations')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
