import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Request, Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: Partial<AppService>;

  beforeEach(async () => {
    appService = {
      getFavicon: ( req:Request, res:Response ) => { return Promise.resolve()}
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide:AppService,
          useValue:appService
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  })

});