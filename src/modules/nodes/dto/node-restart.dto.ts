import { createZodDto } from 'nestjs-zod';

import { NodeRestartContract } from '@contract/commands';


export class NodeRestartRequestDto extends createZodDto(NodeRestartContract.RequestSchema) {}
export class NodeRestartResponseDto extends createZodDto(NodeRestartContract.ResponseSchema) {}