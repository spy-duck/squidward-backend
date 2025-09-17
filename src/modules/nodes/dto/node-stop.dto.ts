import { createZodDto } from 'nestjs-zod';

import { NodeStopContract } from '@contract/commands';


export class NodeStopRequestDto extends createZodDto(NodeStopContract.RequestSchema) {}
export class NodeStopResponseDto extends createZodDto(NodeStopContract.ResponseSchema) {}