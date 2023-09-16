import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { lastValueFrom, map } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  //コンストラスター
  constructor(
    private httpService:HttpService,
  ){}
  // 初期サンプル
  getHello(): string {
    return 'Hello World!';
  }
  // Faviconの返却メソッド
  async getFaviconPath(req:Request, res:Response){
    // IPアドレスの取得
    const getIp:string = typeof req.headers['x-forwarded-for'] == 'string' ? req.headers['x-forwarded-for'] : '124.0.0.1';
    // 国の取得
    const resultCountry = await lastValueFrom(
      this.httpService
        .get("https://ip-api.com/json/"+getIp)
        .pipe(map((response) => response.data)),
    );
    // ファイル保存先の作成
    const imagePath:string = path.join(__dirname,'../upload/',resultCountry.countryCode,'/favicon.png');
    // ファイルの保存&ファイルの返却
    if(!fs.existsSync(imagePath)){
      fs.writeFile("https://flagsapi.com/"+resultCountry.countryCode+"flat/32.png", imagePath, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return;
        }
        console.log('File saved successfully.');
        fs.createReadStream(imagePath).pipe(res);
      });
    } else {
      fs.createReadStream(imagePath).pipe(res);
    }
  }
}
