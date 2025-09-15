import { createZodDto } from 'nestjs-zod';

import { ConfigCreateContract } from '@contract/commands';


export class ConfigCreateRequestDto extends createZodDto(ConfigCreateContract.RequestSchema) {}
export class ConfigCreateResponseDto extends createZodDto(ConfigCreateContract.ResponseSchema) {}