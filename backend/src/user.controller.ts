import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {UsersService} from "./users.service";
import {User} from "./user.entity";


@Controller()
export class UserController {

    constructor(private readonly appService: AppService, private usersService: UsersService) {
        console.log("test")
        let user: User = {id:1, firstName:"aaah", lastName:"bbbbb", isActive:true};
        usersService.putOne(user);
         usersService.findOne(1).then((result)=> console.log(result));
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }


}
