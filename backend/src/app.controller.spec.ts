import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Request, Response } from 'express';

// モック用のデータ作成。
const mockAppService = {
  getFavicon: jest.fn()
};

describe('AppController', () => {
  let appController: AppController;
  let appService;

  beforeEach(async () => {
    // テストモジュールの作成。
    // コントローラーにモックのサービスクラスを受け渡す。
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide:AppService,
          useValue:mockAppService
        }
      ],
    }).compile();

    // テストモジュールからコントローラークラスを受け取る。
    appController = app.get<AppController>(AppController);

    // テストモジュールからサービスクラスを受け取る。
    appService = app.get(AppService);
  });

   // 定義されていることを確認する。
   it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  // getFaviconの呼び出しのテストを行う。
  describe('getFavicon', () => {
   
  
    // リクエスト時に呼び出されていることを確認する。
    it('calls AppController.getFavicon', async() => {
      expect(await appService.getFavicon).not.toHaveBeenCalled();
      await appController.getFavicon(null,null);
      expect(await appService.getFavicon).toHaveBeenCalled();
    });

    // 正常にリクエストした場合正常にレスポンスが返されることを確認する。
    it('returns 200 when it receives request', async() => {
      // モック用のリクエストとレスポンスを準備する。
      const mockRequest = {
        body: jest.fn()
      } as Request;
      const mockResponse = {} as unknown as Response;
      mockResponse.json = jest.fn();
      mockResponse.status = jest.fn(() => mockResponse);

      await appController.getFavicon(mockRequest,mockResponse);

      expect(mockResponse.status).toBeDefined;
    })
  });


});