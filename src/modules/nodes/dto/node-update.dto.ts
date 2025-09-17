import { createZodDto } from 'nestjs-zod';

import { NodeUpdateContract } from '@contract/commands';


export class NodeUpdateRequestDto extends createZodDto(NodeUpdateContract.RequestSchema) {}
export class NodeUpdateResponseDto extends createZodDto(NodeUpdateContract.ResponseSchema) {}