import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('EatCount API')
    .setDescription('API for the EatCount application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
