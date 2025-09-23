import { createZodDto } from 'nestjs-zod';

import { NodeKeygenContract } from '@contract/commands';


export class NodeKeygenRequestDto extends createZodDto(NodeKeygenContract.RequestSchema) {}
export class NodeKeygenResponseDto extends createZodDto(NodeKeygenContract.ResponseSchema) {}