import { Module } from '@nestjs/common';

import { ConfigsRepository } from './repositories/configs.repository';
import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';

@Module({
    imports: [],
    controllers: [ ConfigsController ],
    providers: [ ConfigsRepository, ConfigsService ],
})
export class ConfigsModule {}