import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodeAddUserPayloadInterface } from '@/queues/nodes/node-add-user/interfaces';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeHealthCheckQueueService } from '@/queues';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_ADD_USER, {
    concurrency: 40,
})
export class NodeAddUserQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeAddUserQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly nodeHealthCheckQueueService: NodeHealthCheckQueueService,
    ) {
        super();
    }
    
    async process(job: Job<NodeAddUserPayloadInterface>) {
        this.logger.log(`Starting add user to node [userUuid:${ job.data.userUuid } -> nodeUuid:${ job.data.nodeUuid }]`);
        
        const node = await this.nodesRepository.getByUuid(job.data.nodeUuid);
        if (!node) {
            this.logger.error(`Node with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
        
        const user = await this.usersRepository.getByUuid(job.data.userUuid);
        if (!user) {
            this.logger.error(`User with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
        const nodeApi = new NodeApi(node.host, node.port);
        
        const { response } = await nodeApi.addUser({
            uuid: user.uuid,
            username: user.username,
            password: user.password,
        });
        
        if (response.success) {
            await this.nodeHealthCheckQueueService.healthCheckNode({ nodeUuid: node.uuid });
            this.logger.log(`User added to node successfully`);
        } else {
            this.logger.error(
                `Failed to add user to node with error: ${ response.error }`,
            );
        }
    }
}