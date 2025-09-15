import { createZodDto } from 'nestjs-zod';

import { UserUpdateContract } from '@contract/commands';


export class UpdateNodeRequestDto extends createZodDto(UserUpdateContract.RequestSchema) {}
export class UpdateNodeResponseDto extends createZodDto(UserUpdateContract.ResponseSchema) {}