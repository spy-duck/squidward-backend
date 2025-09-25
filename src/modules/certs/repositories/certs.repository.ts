import { Injectable } from '@nestjs/common';

import { MasterCertEntity } from '@/modules/certs/entities/master-cert.entity';
import { CertsMapper } from '@/modules/certs/certs.mapper';
import { Database } from '@/database/database';

@Injectable()
export class CertsRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async getMasterCert(): Promise<MasterCertEntity | null> {
        const node = await this.db
            .selectFrom('certs')
            .selectAll()
            .executeTakeFirst();
        return node ? CertsMapper.toEntity(node) : null;
    }
}