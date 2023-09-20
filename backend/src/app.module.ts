import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname,'/../../','out')
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
