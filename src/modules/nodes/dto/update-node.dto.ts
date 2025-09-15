import { createZodDto } from 'nestjs-zod';

import { NodeUpdateContract } from '@contract/commands';


export class UpdateNodeRequestDto extends createZodDto(NodeUpdateContract.RequestSchema) {}
export class UpdateNodeResponseDto extends createZodDto(NodeUpdateContract.ResponseSchema) {}