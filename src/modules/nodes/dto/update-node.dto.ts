import { createZodDto } from 'nestjs-zod';

import { UpdateNodeContract } from '@contract/commands';


export class UpdateNodeRequestDto extends createZodDto(UpdateNodeContract.RequestSchema) {}
export class UpdateNodeResponseDto extends createZodDto(UpdateNodeContract.ResponseSchema) {}