import { Logger } from '@nestjs/common';

import { Queue } from 'bullmq';

export abstract class QueuesService {
    protected readonly logger: Logger;
    
    protected abstract get queue(): Queue;
    
    protected async checkConnection(): Promise<void> {
        const client = await this.queue.client;
        
        if (client.status !== 'ready') {
            const errorMessage = `Queue "${this.queue.name}" is not connected. Current status: [${client.status.toUpperCase()}]`;
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        
        this.logger.log(`Queue "${this.queue.name}" is connected.`);
    }
    
    protected async drain(delayed?: boolean): Promise<void> {
        return this.queue.drain(delayed);
    }
}