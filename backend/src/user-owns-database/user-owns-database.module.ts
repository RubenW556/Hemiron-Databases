import { Module } from '@nestjs/common';
import { UserOwnsDatabaseController } from './user-owns-database.controller';
import { UserOwnsDatabaseService } from './user-owns-database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOwnsDatabase } from './user-owns-database.entity';
// import { AuthenticationService } from 'hemiron-auth/dist/services/authentication.service';//todo enable auth when fixed

@Module({
  imports: [TypeOrmModule.forFeature([UserOwnsDatabase])],
  controllers: [UserOwnsDatabaseController],
  providers: [
    UserOwnsDatabaseService,
    // AuthenticationService,//todo enable auth when fixed
  ],
})
export class UserOwnsDatabaseModule {}
