import { createZodDto } from 'nestjs-zod';

import { UserCreateContract } from '@contract/commands';


export class CreateUserRequestDto extends createZodDto(UserCreateContract.RequestSchema) {}
export class CreateUserResponseDto extends createZodDto(UserCreateContract.ResponseSchema) {}