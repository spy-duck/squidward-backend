import { Module } from '@nestjs/common';

import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [],
    controllers: [ UsersController ],
    providers: [ UsersRepository, UsersService ],
})
export class UsersModule {}