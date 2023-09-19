import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('favicon.ico')
  async getFaviconPath(@Req() req:Request,@Res() res:Response){
    return this.appService.getFaviconPath(req,res);
  }
}
