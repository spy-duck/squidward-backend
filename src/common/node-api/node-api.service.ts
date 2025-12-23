import { Injectable, OnModuleInit } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { readPackageJSON } from 'pkg-types';
import * as jwt from 'jsonwebtoken';
import * as https from 'node:https';

import { CertsRepository } from '@/modules/certs/repositories/certs.repository';

import {
    NodeHealthContract,
    SquidStartContract,
    SquidStopContract,
    SquidRestartContract,
    SquidConfigContract,
    PostUsersContract,
    AddUserContract,
    RemoveUserContract,
    UpdateUserContract,
    MetricsUsersContract,
    MetricsNodeContract,
} from '@squidward-node/contracts';

@Injectable()
export class NodeApiService implements OnModuleInit {
    private readonly nodeAxios: AxiosInstance;
    
    constructor(
        private readonly certsRepository: CertsRepository,
    ) {
        this.nodeAxios = axios.create({
            timeout: 10_000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': `squidward-backend/`,
            },
        });
        readPackageJSON()
            .then((pkg) => {
                this.nodeAxios.defaults.headers['User-Agent'] = `squidward-backend/${ pkg.version }`;
            });
    }
    
    async onModuleInit(): Promise<void> {
        const masterCert = await this.certsRepository.getMasterCert();
        
        if (!masterCert) {
            throw new Error('Master cert not found');
        }
        
        this.nodeAxios.defaults.httpsAgent = new https.Agent({
            cert: masterCert.clientCertPem,
            key: masterCert.clientKeyPem,
            ca: masterCert.caCertPem,
            checkServerIdentity: () => undefined,
            rejectUnauthorized: true,
        });
        
        const payload: any = {
            uuid: null,
            username: null,
            role: 'API',
        };
        
        const token = jwt.sign(payload, masterCert.privateKey, {
            algorithm: 'RS256',
            expiresIn: '9999d',
        });
        
        this.nodeAxios.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
    }
    
    private getNodeUrl(host: string, path: string, port: null | number): string {
        const protocol = 'https';
        const portSuffix = port ? `:${ port }` : '';
        return `${ protocol }://${ host }${ portSuffix }${ path }`;
    }
    
    async healthCheck(host: string, port: null | number): Promise<NodeHealthContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, NodeHealthContract.url, port),
            timeout: 5000,
        });
        return NodeHealthContract.ResponseSchema.parseAsync(response.data);
    }
    
    
    async squidStart(host: string, port: null | number): Promise<SquidStartContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, SquidStartContract.url, port),
            timeout: 20000,
        });
        return SquidStartContract.ResponseSchema.parseAsync(response.data);
    }
    
    async squidStop(host: string, port: null | number): Promise<SquidStopContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, SquidStopContract.url, port),
            timeout: 20000,
        });
        return SquidStopContract.ResponseSchema.parseAsync(response.data);
    }
    
    async squidRestart(host: string, port: null | number): Promise<SquidRestartContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, SquidRestartContract.url, port),
            timeout: 20000,
        });
        return SquidRestartContract.ResponseSchema.parseAsync(response.data);
    }
    
    async setSquidConfig(host: string, port: null | number, config: string): Promise<SquidConfigContract.Response> {
        const requestData: SquidConfigContract.Request = {
            config,
        };
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, SquidConfigContract.url, port),
            data: requestData,
            timeout: 20000,
        });
        return SquidConfigContract.ResponseSchema.parseAsync(response.data);
    }
    
    async postUsers(host: string, port: null | number, users: PostUsersContract.Request['data']): Promise<PostUsersContract.Response> {
        const requestData: PostUsersContract.Request = {
            data: users,
        };
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, PostUsersContract.url, port),
            data: requestData,
            timeout: 20000,
        });
        return PostUsersContract.ResponseSchema.parseAsync(response.data);
    }
    
    async addUser(host: string, port: null | number, user: AddUserContract.Request): Promise<AddUserContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, AddUserContract.url, port),
            data: user,
            timeout: 20000,
        });
        return AddUserContract.ResponseSchema.parseAsync(response.data);
    }
    
    async removeUser(host: string, port: null | number, user: RemoveUserContract.Request): Promise<RemoveUserContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, RemoveUserContract.url, port),
            data: user,
            timeout: 20000,
        });
        return RemoveUserContract.ResponseSchema.parseAsync(response.data);
    }
    
    async updateUser(host: string, port: null | number, user: UpdateUserContract.Request): Promise<UpdateUserContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, UpdateUserContract.url, port),
            data: user,
            timeout: 20000,
        });
        return UpdateUserContract.ResponseSchema.parseAsync(response.data);
    }
    
    async getNodeUsersMetrics(host: string, port: null | number): Promise<MetricsUsersContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, MetricsUsersContract.url, port),
            timeout: 5000,
        });
        return MetricsUsersContract.ResponseSchema.parseAsync(response.data);
    }
    
    async getNodeMetrics(host: string, port: null | number): Promise<MetricsNodeContract.Response> {
        const response = await this.nodeAxios.request({
            method: 'POST',
            url: this.getNodeUrl(host, MetricsNodeContract.url, port),
            timeout: 5000,
        });
        return MetricsNodeContract.ResponseSchema.parseAsync(response.data);
    }
}