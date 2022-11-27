import {IsUUID} from 'class-validator';

export class createUserDto{
    @IsUUID(4)
    readonly user_id:string
    readonly username:string;
}