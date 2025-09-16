import { Injectable } from '@nestjs/common';

import {
    NodeHealthContract,
    SquidStartContract,
    SquidStopContract,
    SquidRestartContract,
} from '@squidward-node/contracts';
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
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: NodeHealthContract.url,
            timeout: 5000,
        });
        return NodeHealthContract.ResponseSchema.parse(response.data);
    }
    
    async squidStart(): Promise<SquidStartContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: SquidStartContract.url,
            timeout: 20000,
        });
        return NodeHealthContract.ResponseSchema.parse(response.data);
    }
    
    async squidStop(): Promise<SquidStopContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: SquidStopContract.url,
            timeout: 20000,
        });
        return SquidStopContract.ResponseSchema.parse(response.data);
    }
    
    async squidRestart(): Promise<SquidRestartContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: SquidRestartContract.url,
            timeout: 20000,
        });
        return SquidRestartContract.ResponseSchema.parse(response.data);
    }
}