import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Request, Response } from 'express';

// モック用のデータ作成。
const mockHttpService = {
  get: jest.fn()
};

describe('AppService', () => {
  let appService: AppService;
  let httpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getFavicon', () => {
    // モック用のリクエストとレスポンスを準備する。
    const mockRequest = {
      ip: '124.0.0.1'
    } as Request;
    const mockResponse = {} as unknown as Response;
    mockResponse.json = jest.fn();
    mockResponse.status = jest.fn(() => mockResponse);
    mockResponse.send = jest.fn();

    it('should return a favicon', async () => {
      //モック用のデータを準備する。
      const countryCode = 'KR';
      const mockCountryResponse = {
        data: { countryCode },
      };
      const mockFlagResponse = {
        data: Buffer.from('../test/favicon.ico'), 
      };

      httpService.get = jest
        .fn()
        .mockReturnValueOnce(of(mockCountryResponse))
        .mockReturnValueOnce(of(mockFlagResponse));


      appService.getFavicon(mockRequest, mockResponse);

      // HTTPレスポンスの呼び出しを確認する。
      expect(mockResponse).toHaveBeenCalled;
    });

  });
});