import { Injectable } from '@nestjs/common';

import { NodeHealthContract } from '@squidward-node/contracts';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class NodeApi {
    private readonly nodeAxios: AxiosInstance;
    constructor(host: string, port: number) {
        this.nodeAxios = axios.create({
            baseURL: `http://${host}:${port}`,
        });
    }
    
    async getStatus(): Promise<NodeHealthContract.Response> {
        const response = await this.nodeAxios.post(NodeHealthContract.url);
        return NodeHealthContract.ResponseSchema.parse(response.data);
    }
}