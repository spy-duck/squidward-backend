import { createZodDto } from 'nestjs-zod';

import { NodeCreateContract } from '@contract/commands';


export class CreateNodeRequestDto extends createZodDto(NodeCreateContract.RequestSchema) {}
export class CreateNodeResponseDto extends createZodDto(NodeCreateContract.ResponseSchema) {}