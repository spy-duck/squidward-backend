import { createZodDto } from 'nestjs-zod';

import { RemoveNodeContract } from '@contract/commands/nodes/remove-node.contract';


export class RemoveNodeRequestDto extends createZodDto(RemoveNodeContract.RequestSchema) {}
export class RemoveNodeResponseDto extends createZodDto(RemoveNodeContract.ResponseSchema) {}