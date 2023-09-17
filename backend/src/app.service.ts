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
        .get("http://ip-api.com/json/"+getIp)
        .pipe(map((response) => response.data)),
    );
    // 国旗の取得
    const streamFile = await lastValueFrom(
      this.httpService
        .get("https://flagsapi.com/"+resultCountry.countryCode+"/flat/32.png",{
          responseType: "arraybuffer"
        })
        .pipe(map((response) => response.data))
    );
    // ファイル保存先の作成
    const imageFolderPath:string = path.join(__dirname,'../upload/',resultCountry.countryCode);
    const imageFilePath:string = path.join(__dirname,'../upload/',resultCountry.countryCode,"/favicon.png");

    // ファイルの保存&ファイルの返却
    if(!fs.existsSync(imageFilePath)){
      fs.mkdir(imageFolderPath, {recursive: true}, (err) => {
        if (err) {
          console.error('Error creating to folder:', err);
          return;
        }
        console.log('Folder created successfully.')

        fs.writeFile(imageFilePath,streamFile, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return;
          }
          console.log('File saved successfully.');
          fs.createReadStream(imageFilePath).pipe(res);
          });
      })
    } else {
    fs.createReadStream(imageFilePath).pipe(res);
    }
  }
}
