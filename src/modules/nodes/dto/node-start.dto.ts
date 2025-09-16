import { createZodDto } from 'nestjs-zod';

import { NodeStartContract } from '@contract/commands';


export class NodeStartRequestDto extends createZodDto(NodeStartContract.RequestSchema) {}
export class NodeStartResponseDto extends createZodDto(NodeStartContract.ResponseSchema) {}