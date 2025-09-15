import { createZodDto } from 'nestjs-zod';

import { ConfigsListContract } from '@contract/commands';


export class ConfigsListRequestDto extends createZodDto(ConfigsListContract.RequestSchema) {}
export class ConfigsListResponseDto extends createZodDto(ConfigsListContract.ResponseSchema) {}