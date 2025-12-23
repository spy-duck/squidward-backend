import { createZodDto } from 'nestjs-zod';

import { NodeResetTrafficContract } from '@contract/commands';


export class NodeResetTrafficParamsDto extends createZodDto(NodeResetTrafficContract.ParamsSchema) {}
export class NodeResetTrafficResponseDto extends createZodDto(NodeResetTrafficContract.ResponseSchema) {}