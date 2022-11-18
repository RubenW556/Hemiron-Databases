import {Controller, Get, Query} from '@nestjs/common';
import {AppService} from '../app.service';
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {v4 as uuidv4} from 'uuid';


@Controller("users")
export class UserController {

    constructor(private readonly appService: AppService, private usersService: UsersService) {
        let user: User = new User();
        user.username = "hallo";
        user.user_id = uuidv4();
        usersService.putOne(user)
    }

    @Get()
    async getUserById(@Query("id") user_id): Promise<User[]> {
        return await this.usersService.findAll();
    }
}
