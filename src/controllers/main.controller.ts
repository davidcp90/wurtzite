import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

@Controller('main')
export class MainController {
  @Get()
  private getMain(req: Request, res: Response) {
    return res.status(200).json({message: 'Wurtzite is working'});
  }
}
