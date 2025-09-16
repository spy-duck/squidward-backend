import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { ConfigEntity } from '@/modules/configs/entities/config.entity';
import { NodeEntity } from '@/modules/nodes/entities/node.entity';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_START, {
    concurrency: 40,
})
export class NodeStartQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeStartQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly configsRepository: ConfigsRepository,
    ) {
        super();
    }
    
    async process(job: Job<{ nodeUuid: string }>) {
        this.logger.log(`Starting node with uuid ${ job.data.nodeUuid }`);
        const node = await this.nodesRepository.getByUuid(job.data.nodeUuid);
        if (!node) {
            this.logger.error(`Node with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
        const config = await this.configsRepository.getByUuid(node.configId);
        if (!config) {
            this.logger.error(`Config with uuid ${ node.configId } for node ${node.uuid} not found`);
            return;
        }
        const nodeApi = new NodeApi(node.host, node.port);
        const isConfigUpdatedSuccessfully = await this.setNodeConfig(nodeApi, node, config);
        if (isConfigUpdatedSuccessfully) {
            this.logger.log('Config updated successfully');
            const { response } = await nodeApi.squidStart();
            if (response.success) {
                this.logger.log(`Node ${ node.name } [${ node.uuid }] started successfully`);
            } else {
                this.logger.error(
                    `Node ${ node.name } [${ node.uuid }] failed to start with error: ${ response.error }`,
                );
            }
        }
    }
    
    async setNodeConfig(nodeApi: NodeApi, node: NodeEntity, config: ConfigEntity): Promise<boolean> {
        const { response } = await nodeApi.squidStop();
        if (!response.success) {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to update config [${config.uuid}] with error: ${ response.error }`,
            );
        }
        return response.success;
    }
}