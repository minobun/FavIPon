import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { lastValueFrom, map } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import Jimp from "jimp";

@Injectable()
export class AppService {
  //コンストラスター
  constructor(
    private httpService:HttpService,
  ){}
  
  // Faviconの返却メソッド
  async getFavicon(req:Request, res:Response){
    try{
      // IPアドレスの取得
      const ip:string = req.ips.at(0) as string || '124.0.0.1';
      console.log(ip);

      // 国の取得
      const resultCountryCode:string = await this.getCountryCode(ip) || 'JP';
      console.log(resultCountryCode);

      // ファイル保存先の作成
      const imageFolderPath:string = path.join(__dirname,'../upload/',resultCountryCode);
      const imageFilePath:string = path.join(__dirname,'../upload/',resultCountryCode,"/favicon.png");
      const imageIconPath:string = path.join(__dirname,'../upload/',resultCountryCode,"/favicon.ico");

      // ファイルの保存&ファイルの返却
      if(!fs.existsSync(imageIconPath)){
        // 国旗の取得
        const streamFile = await this.getCountryFlag(resultCountryCode);
        await this.createFolder(imageFolderPath);
        await this.saveImageToFile(imageFilePath, streamFile);
        await this.convertPngToIcon(imageFilePath, imageIconPath);
        this.sendFile(res, imageIconPath);
      } else {
        this.sendFile(res, imageIconPath)
      }
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('an error occurred');
    }
  }

  private async getCountryCode(ip:string) {
      const response = await lastValueFrom(
        this.httpService
          .get(`http://ip-api.com/json/${ip}`)
          .pipe(map((res) => res.data))
      );
      return response.countryCode;
  }

  private async getCountryFlag(resultCountryCode: any) {
      return  await lastValueFrom(
      this.httpService
        .get("https://flagsapi.com/" + resultCountryCode + "/flat/32.png", {
          responseType: "arraybuffer"
        })
        .pipe(map((response) => response.data))
      );
    
  }

  private createFolder(folderPath:string) {
      return new Promise<void>((resolve,reject) => {
      fs.mkdir(folderPath, {recursive:true}, (err) => {
        if (err) {
          console.error('Error creating folder:', err);
          reject(err);
        } else {
          console.log('Folder created successfully.');
          resolve();
        }
      });
    
    });
  }

  private saveImageToFile(filePath: string, data: Buffer) {
      return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          reject(err);
        } else {
          console.log('File saved successfully.');
          resolve();
        }
      });
    });

  }

  private convertPngToIcon(imageFilePath: string, iconFilePath: string) {
      return new Promise<void>((resolve, reject) => {
      Jimp.read(imageFilePath, (err, icon) => {
        if (err) {
          console.error('Error converting image:', err);
          reject(err);
        } else {
          icon.write(iconFilePath);
          console.log('Image converted successfully.');
          resolve();
        }
        });
      });
    
  }

  private sendFile(res:Response, filePath:string) {
    const stream = fs.createReadStream(filePath);
    stream.on('error', (error) => {
      console.error('error:', error)
      res.statusCode = 500;
      res.end('an error occurred');
    });
    stream.pipe(res);
  }
}


