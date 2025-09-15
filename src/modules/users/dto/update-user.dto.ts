import { createZodDto } from 'nestjs-zod';

import { UserUpdateContract } from '@contract/commands';


export class UserUpdateRequestDto extends createZodDto(UserUpdateContract.RequestSchema) {}
export class UserUpdateResponseDto extends createZodDto(UserUpdateContract.ResponseSchema) {}