import { createZodDto } from 'nestjs-zod';

import { NodeRemoveContract } from '@contract/commands/nodes/node-remove.contract';


export class RemoveNodeRequestDto extends createZodDto(NodeRemoveContract.RequestSchema) {}
export class RemoveNodeResponseDto extends createZodDto(NodeRemoveContract.ResponseSchema) {}