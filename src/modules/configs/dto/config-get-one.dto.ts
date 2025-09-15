import { createZodDto } from 'nestjs-zod';

import { ConfigGetOneContract } from '@contract/commands';


export class ConfigGetOneRequestDto extends createZodDto(ConfigGetOneContract.RequestSchema) {}
export class ConfigGetOneResponseDto extends createZodDto(ConfigGetOneContract.ResponseSchema) {}