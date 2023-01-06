import { IsUUID } from 'class-validator';

export class UserOwnsDatabaseDto {
    @IsUUID(4)
    readonly database_id: string;

    @IsUUID(4)
    readonly user_id: string;
}
