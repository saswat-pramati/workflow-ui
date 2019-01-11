import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IConnectionType } from '../model/dataModel';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  runEvent: Subject<any> = new Subject();
  workflowName: Subject<string> = new Subject();
  // linkEvent: Subject<IConnectionType> = new Subject();
  intimateClickSave: Subject<boolean> = new Subject();

  constructor() { }

  pushRunEvent() {
    this.runEvent.next(true);
  }

  pushSaveEvent(name: string) {
    this.workflowName.next(name);
  }

  // pushLinkEvent(event: IConnectionType) {
  //   this.linkEvent.next(event);
  // }

  intimateSave(event: boolean) {
    this.intimateClickSave.next(event);
  }

}
