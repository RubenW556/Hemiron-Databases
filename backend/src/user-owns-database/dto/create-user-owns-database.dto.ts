import { IsUUID } from "class-validator";

export class CreateUserOwnsDatabaseDto {

    @IsUUID(4)
    readonly database_id: string

    @IsUUID(4)
    readonly user_id: string

}