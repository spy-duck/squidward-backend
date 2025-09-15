import { createZodDto } from 'nestjs-zod';

import { ConfigRemoveContract } from '@contract/commands';


export class ConfigRemoveRequestDto extends createZodDto(ConfigRemoveContract.RequestSchema) {}
export class ConfigRemoveResponseDto extends createZodDto(ConfigRemoveContract.ResponseSchema) {}