import { Module } from '@nestjs/common';

import { ApiTokensRepository } from './repositories/api-tokens.repository';
import { ApiTokensController } from './api-tokens.controller';
import { ApiTokensService } from './api-tokens.service';

@Module({
    imports: [],
    controllers: [ ApiTokensController ],
    providers: [ ApiTokensRepository, ApiTokensService ],
})
export class ApiTokensModule {}