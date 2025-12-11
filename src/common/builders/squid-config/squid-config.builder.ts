import { Injectable } from '@nestjs/common';

import nunjucks from 'nunjucks';

import { ConfigEntity } from '@/modules/configs/entities/config.entity';
import { NodeEntity } from '@/modules/nodes/entities';

@Injectable()
export class SquidConfigBuilder {
    static buildConfig(
        node: NodeEntity,
        config: ConfigEntity,
    ): string {
        return nunjucks.renderString(
            config.config,
            {
                node: {
                    ...node,
                    speedLimit: node.speedLimit && node.speedLimit * 125_000,
                },
            }
        )
    }
}