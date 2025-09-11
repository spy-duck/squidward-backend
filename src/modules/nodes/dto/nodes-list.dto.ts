import { createZodDto } from 'nestjs-zod';

import { NodesListContract } from '@contract/commands';


export class NodesListRequestDto extends createZodDto(NodesListContract.RequestSchema) {}
export class NodesListResponseDto extends createZodDto(NodesListContract.ResponseSchema) {}