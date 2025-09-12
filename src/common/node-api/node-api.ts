import { Injectable } from '@nestjs/common';

import { NodeHealthContract } from '@swuidward-node/contracts';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class NodeApi {
    private readonly nodeAxios: AxiosInstance;
    constructor(host: string, port: number) {
        const url = new URL(host);
        url.port = String(port);
        console.log(url.toString());
        this.nodeAxios = axios.create({
            baseURL: url.toString(),
        });
    }
    getStatus() {
        return this.nodeAxios.post(NodeHealthContract.url);
    }
}