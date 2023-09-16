import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getFaviconPath(req:Request, res:Response){
    const getIp:string = typeof req.headers['x-forwarded-for'] == 'string' ? req.headers['x-forwarded-for'] : '0.0.0.0';
    const imagePath:string = path.join(__dirname,getIp == '0.0.0.0' ? '../upload/test1.png':'../upload/test2.png');
    fs.createReadStream(imagePath).pipe(res);
  }
}
