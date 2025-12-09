import { Logger } from '@nestjs/common';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

export abstract class QueuesService {
    protected readonly logger: Logger;
    
    protected abstract get queue(): Queue;
    
    protected async checkConnection(): Promise<void> {
        const client = await this.queue.client;
        const queueName = upperFirst(camelCase(this.queue.name));
        
        if (client.status !== 'ready') {
            const errorMessage = `Queue "${queueName}" is not connected. Current status: [${client.status.toUpperCase()}]`;
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        
        this.logger.log(`Queue "${queueName}" is connected.`);
    }
    
    protected async drain(delayed?: boolean): Promise<void> {
        return this.queue.drain(delayed);
    }
}