import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
const newrelic = require('newrelic');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() data:any): string {
    console.log ('received payload ',data)
    const backgroundHandle = newrelic.getTransaction()
    newrelic.addCustomAttribute('service','child')
    // Link the outer transaction by accepting its headers as a payload
    // with the inner transaction's handle
    backgroundHandle.acceptDistributedTraceHeaders('Unknown', data)
    // End the transactions 
    //backgroundHandle.end()
   // newrelic.endTransaction()
    return this.appService.getHello();
  }
}
