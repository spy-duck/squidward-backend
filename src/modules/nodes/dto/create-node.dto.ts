import { createZodDto } from 'nestjs-zod';

import { CreateNodeContract } from '@contract/commands';


export class CreateNodeRequestDto extends createZodDto(CreateNodeContract.RequestSchema) {}
export class CreateNodeResponseDto extends createZodDto(CreateNodeContract.ResponseSchema) {}