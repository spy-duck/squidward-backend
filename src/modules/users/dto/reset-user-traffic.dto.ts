import { createZodDto } from 'nestjs-zod';

import { UserResetTrafficContract } from '@contract/commands';


export class ResetUserTrafficParamsDto extends createZodDto(UserResetTrafficContract.ParamsSchema) {}
export class ResetUserTrafficResponseDto extends createZodDto(UserResetTrafficContract.ResponseSchema) {}