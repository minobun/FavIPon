import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('favicon')
  async getFaviconPath(@Req() req:Request,@Res() res:Response){
    return this.appService.getFaviconPath(req,res);
  }
}