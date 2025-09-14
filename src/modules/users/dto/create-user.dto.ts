import { createZodDto } from 'nestjs-zod';

import { CreateUserContract } from '@contract/commands';


export class CreateUserRequestDto extends createZodDto(CreateUserContract.RequestSchema) {}
export class CreateUserResponseDto extends createZodDto(CreateUserContract.ResponseSchema) {}