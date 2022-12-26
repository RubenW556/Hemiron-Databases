import { IsUUID } from 'class-validator';

export class createUserDto {
  @IsUUID(4)
  readonly id: string;
}
