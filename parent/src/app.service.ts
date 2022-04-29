// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelic = require('newrelic');
import { Injectable, HttpService } from '@nestjs/common';
import { response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private http: HttpService) { }
  getHello(): any {
    //return newrelic.startSegment('getHelloService', false, () => {
    console.log('Calling child ...');
    const transactionHandle = newrelic.getTransaction()

    // Generate the payload right before creating the linked transaction.
    const headers = {}
    newrelic.addCustomAttribute('service','parent')
    transactionHandle.insertDistributedTraceHeaders(headers)
    console.log('Need to send this over to queue to the receiving service',JSON.stringify(headers))
    return this.http
      .post('http://localhost:3001',headers)
      .pipe(
        map((response) => {
          console.log(`Child says ${JSON.stringify(response.data)}`);
          return 'child service said:' + response.data;
        }
        ),
      );
    // });
  }
}
