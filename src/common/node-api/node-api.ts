import { Injectable } from '@nestjs/common';

import {
    NodeHealthContract,
    SquidStartContract,
    SquidStopContract,
    SquidRestartContract,
    SquidConfigContract,
    PostUsersContract,
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
    
    async setSquidConfig(config: string): Promise<SquidConfigContract.Response> {
        const requestData: SquidConfigContract.Request = {
            config,
        };
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: SquidConfigContract.url,
            data: requestData,
            timeout: 20000,
        });
        return SquidConfigContract.ResponseSchema.parse(response.data);
    }
    
    async postUsers(users: PostUsersContract.Request['data']): Promise<PostUsersContract.Response> {
        const requestData: PostUsersContract.Request = {
            data: users,
        };
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: PostUsersContract.url,
            data: requestData,
            timeout: 20000,
        });
        return PostUsersContract.ResponseSchema.parse(response.data);
    }
}