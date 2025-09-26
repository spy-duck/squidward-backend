import { createZodDto } from 'nestjs-zod';

import { UserRemoveContract } from '@contract/commands';


export class RemoveUserRequestDto extends createZodDto(UserRemoveContract.RequestSchema) {}
export class RemoveUserResponseDto extends createZodDto(UserRemoveContract.ResponseSchema) {}