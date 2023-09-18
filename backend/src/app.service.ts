import { ConsoleLogger, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { catchError, lastValueFrom, map } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import Jimp from "jimp";
import { AxiosError } from 'axios';

@Injectable()
export class AppService {
  //コンストラスター
  constructor(
    private httpService:HttpService,
  ){}
  getHello(){
    return "Hello World!";
  }
  // Faviconの返却メソッド
  async getFaviconPath(req:Request, res:Response){
    // IPアドレスの取得
    const getIp:string = typeof req.ip == 'string' ? req.ip : '124.0.0.1';
    console.log(getIp);
    // 国の取得
    const resultCountry = await lastValueFrom(
      this.httpService
        .get("http://ip-api.com/json/"+getIp)
        .pipe(
          map((response) => response.data),
          catchError((error:AxiosError) => {
            console.error('Error getting country:', error.response.data);
            throw 'An error happened';
          })
        ),
    );
    // 国旗の取得
    const streamFile = await lastValueFrom(
      this.httpService
        .get("https://flagsapi.com/"+resultCountry.countryCode+"/flat/32.png",{
          responseType: "arraybuffer"
        })
        .pipe(map((response) => response.data),
        catchError((error:AxiosError) => {
          console.error('Error getting country:', error.response.data);
          throw 'An error happened';
        })
      ),
    );
    // ファイル保存先の作成
    const imageFolderPath:string = path.join(__dirname,'../upload/',resultCountry.countryCode);
    const imageFilePath:string = path.join(__dirname,'../upload/',resultCountry.countryCode,"/favicon.png");
    const imageIconPath:string = path.join(__dirname,'../upload/',resultCountry.countryCode,"/favicon.ico");

    // ファイルの保存&ファイルの返却
    if(!fs.existsSync(imageIconPath)){
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
          Jimp.read(imageFilePath,(err, icon) => {
            if (err) {
              console.error('Error converting image:', err)
              return;
            }
            icon.write(imageIconPath);
            console.log('Image converted successfully.');
            fs.createReadStream(imageIconPath).pipe(res);
            })
          });
      })
    } else {
      fs.createReadStream(imageIconPath).pipe(res);
    }
  }
}
