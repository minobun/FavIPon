import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getFavicon', () => {
    const mockRequest = {
      ip: '124.0.0.1', 
    } as any;

    const mockResponse = {
      send: jest.fn(),
      status: jest.fn(),
    } as any;

    it('should return a favicon', async () => {
      // Mock the HTTP service's get method to return a response
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

      const createReadStreamSpy = jest.spyOn(fs, 'createReadStream');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      await appService.getFavicon(mockRequest, mockResponse);

      // Assert that the response is sent with status 200
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      // Assert that createReadStream is called with the correct file path
      expect(createReadStreamSpy).toHaveBeenCalledWith(expect.stringContaining('favicon.ico'));
      // Assert that console.error is not called (no errors occurred)
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      // Mock the HTTP service's get method to throw an error
      httpService.get = jest
        .fn()
        .mockReturnValueOnce(of({}))
        .mockReturnValueOnce(Promise.reject('An error happened'));

      const consoleErrorSpy = jest.spyOn(console, 'error');

      await appService.getFavicon(mockRequest, mockResponse);

      // Assert that the response is sent with status 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      // Assert that console.error is called with an error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('an error occurred:', 'An error happened');
    });
  });
});