import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('favicon.ico')
  async getFavicon(@Req() req:Request,@Res() res:Response){
    return this.appService.getFavicon(req,res);
  }
}
