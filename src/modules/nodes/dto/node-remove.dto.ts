import { createZodDto } from 'nestjs-zod';

import { NodeRemoveContract } from '@contract/commands/nodes/node-remove.contract';


export class NodeRemoveRequestDto extends createZodDto(NodeRemoveContract.RequestSchema) {}
export class NodeRemoveResponseDto extends createZodDto(NodeRemoveContract.ResponseSchema) {}