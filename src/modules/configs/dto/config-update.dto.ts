import { createZodDto } from 'nestjs-zod';

import { ConfigUpdateContract } from '@contract/commands';


export class ConfigUpdateRequestDto extends createZodDto(ConfigUpdateContract.RequestSchema) {}
export class ConfigUpdateResponseDto extends createZodDto(ConfigUpdateContract.ResponseSchema) {}