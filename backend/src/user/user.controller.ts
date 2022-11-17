import {Controller, Get, Query} from '@nestjs/common';
import { AppService } from '../app.service';
import {UsersService} from "./users.service";
import {User} from "./user.entity";


@Controller("users")
export class UserController {

    constructor(private readonly appService: AppService, private usersService: UsersService) {
        usersService.findOne(1).then((result)=>{
            if(result==null){
                let user: User = {id:1, firstName:"aaah", lastName:"bbbbb", isActive:true};
                usersService.putOne(user);
            }
        })
    }

    @Get()
    async getUserById(@Query("id") id): Promise<User> {
        const user = await this.usersService.findOne(id);
        return user;
    }
}
