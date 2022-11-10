import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesController } from './databases/databases.controller';

@Module({
  imports: [],
  controllers: [AppController, DatabasesController],
  providers: [AppService],
})
export class AppModule {
}
