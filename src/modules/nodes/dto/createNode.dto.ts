import { CreateNodeContract } from '@/contracts/commands';
import { createZodDto } from 'nestjs-zod';


export class CreateNodeRequestDto extends createZodDto(CreateNodeContract.RequestSchema) {}
export class CreateNodeResponseDto extends createZodDto(CreateNodeContract.ResponseSchema) {}