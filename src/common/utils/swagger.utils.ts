import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from 'src/config/swagger.config';
import type { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/docs.json',
    yamlDocumentUrl: '/docs.yaml',
    customSiteTitle: 'EatCount API Documentation',
  });
}
