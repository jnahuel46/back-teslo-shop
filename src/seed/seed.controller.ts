import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

    @Get()
    @ApiOperation({ summary: 'Execute seed of the database' })
  @ApiResponse({ status: 200, description: 'Seed executed.' })
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
