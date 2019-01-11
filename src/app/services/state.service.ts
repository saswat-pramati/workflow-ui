import { Injectable } from '@angular/core';
import { IDataModel, ILinkModel } from './../model/dataModel';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  activityListState = [];
  activityListPoppedState = [];

  linkListState = [];
  linkListPoppedState = [];

  constructor() { }

  saveState(activity: IDataModel[], linkList: ILinkModel[]) {
    // tslint:disable-next-line:no-unused-expression
    activity.length && this.activityListState.push(activity);
    // tslint:disable-next-line:no-unused-expression
    linkList.length && this.linkListState.push(linkList);
  }

  clearState() {
    this.activityListState = [];
    this.activityListPoppedState = [];

    this.linkListState = [];
    this.linkListPoppedState = [];
  }

  unDo() {
    // tslint:disable-next-line:no-unused-expression
    this.activityListState.length && this.activityListPoppedState.push(this.activityListState.pop());
    // tslint:disable-next-line:no-unused-expression
    this.linkListState && this.linkListPoppedState.push(this.linkListState.pop());
  }

  reDo() {
    // tslint:disable-next-line:no-unused-expression
    this.activityListPoppedState.length && this.activityListState.push(this.activityListPoppedState.pop());
    // tslint:disable-next-line:no-unused-expression
    this.linkListPoppedState.length && this.linkListState.push(this.linkListPoppedState.pop());
  }

}
