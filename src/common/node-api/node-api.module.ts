import { Module } from '@nestjs/common';

import { CertsRepository } from '@/modules/certs/repositories/certs.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';

@Module({
    providers: [
        CertsRepository,
        NodeApiService,
    ],
    exports: [
        CertsRepository,
        NodeApiService,
    ],
})
export class NodeApiModule {}