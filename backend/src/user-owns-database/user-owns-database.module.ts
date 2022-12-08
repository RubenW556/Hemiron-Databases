import { Module } from '@nestjs/common';
import { UserOwnsDatabaseController } from "./user-owns-database.controller";
import { UserOwnsDatabaseService } from "./user-owns-database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOwnsDatabase } from "./user-owns-database.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserOwnsDatabase])],
    controllers: [UserOwnsDatabaseController],
    providers: [UserOwnsDatabaseService],
})
export class UserOwnsDatabaseModule {

}
