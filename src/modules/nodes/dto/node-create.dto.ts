import { createZodDto } from 'nestjs-zod';

import { NodeCreateContract } from '@contract/commands';


export class NodeCreateRequestDto extends createZodDto(NodeCreateContract.RequestSchema) {}
export class NodeCreateResponseDto extends createZodDto(NodeCreateContract.ResponseSchema) {}