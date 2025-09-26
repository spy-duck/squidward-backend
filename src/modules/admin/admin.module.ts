import { Module } from '@nestjs/common';

import { AdminRepository } from '@/modules/admin/repositories/admin.repository';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    controllers: [ AdminController ],
    providers: [ AdminRepository, AdminService ],
})
export class AdminModule {}
