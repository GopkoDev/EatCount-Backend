import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Health Check',
    description: 'Endpoint to check the health status of the application.',
  })
  @ApiOkResponse({
    description: 'Returns the health status of the application.',
    schema: {
      example: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: 12345, // Example uptime in seconds
      },
    },
  })
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
