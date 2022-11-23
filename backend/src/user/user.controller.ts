import {Controller, Get, Put, Query} from '@nestjs/common';
import {AppService} from '../app.service';
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {v4 as uuidv4} from 'uuid';

@Controller("users")
export class UserController {

    constructor(private readonly appService: AppService, private usersService: UsersService) {

    }

    /**
     * Api endpoint for getting user by id
     * @param {string} userId user id of requested user
     */

    @Get()
    async getUserById(@Query("id") userId): Promise<User> {
        return await this.usersService.findOne(userId);
    }

    /**
     * Api endpoint for creating user returns the id of made user
     * @param {string} userId username name of user made
     */

    @Put()
    async createUser(@Query("username") username): Promise<string> {
        let user:User = new User();
        user.user_id = uuidv4();
        console.log(user.user_id)
        user.username = username;
        await this.usersService.putOne(user);
        return user.user_id;
    }

}
