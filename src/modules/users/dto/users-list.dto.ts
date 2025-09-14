import { createZodDto } from 'nestjs-zod';

import { UsersListContract } from '@contract/commands';


export class UsersListRequestDto extends createZodDto(UsersListContract.RequestSchema) {}
export class UsersListResponseDto extends createZodDto(UsersListContract.ResponseSchema) {}