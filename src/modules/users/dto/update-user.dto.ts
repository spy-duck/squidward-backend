import { createZodDto } from 'nestjs-zod';

import { UpdateUserContract } from '@contract/commands';


export class UpdateNodeRequestDto extends createZodDto(UpdateUserContract.RequestSchema) {}
export class UpdateNodeResponseDto extends createZodDto(UpdateUserContract.ResponseSchema) {}