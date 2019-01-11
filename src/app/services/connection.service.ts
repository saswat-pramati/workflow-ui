import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  connect: Subject<any> = new Subject<any>();
  receive: Subject<any> = new Subject<any>();

  constructor() { }

  pushConnectStartPoint(startPoint: any) {
    this.connect.next(startPoint);
  }

  pushReceiverPoint(endPoint: any) {
    this.receive.next(endPoint);
  }

}
