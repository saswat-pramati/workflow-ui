import { Injectable } from '@angular/core';
import { ControlType } from '../control-type/controlType';
import { IWorkflowStep } from '../model/dataModel';
import { IDataModel, IWorkflow } from './../model/dataModel';

@Injectable({
  providedIn: 'root'
})
export class UtililtyService {

  REQUIRED_STEP_TYPES = [ControlType.ACTIVITY.toString(), ControlType.CONDITION.toString()];
  START = 'Start';
  END = 'End';

  constructor() { }

  removeFromArray(arr: number[], item: number) {
    // tslint:disable-next-line:triple-equals
    arr.splice(arr.findIndex(i => i == item), 1);
    return arr;
  }

  makeDefaultWorkflowStep(type: string, activityList: IDataModel[]): IWorkflowStep {
    if (type === ControlType.ACTIVITY) {
      return {Id: 'Activity' + (+activityList.filter(f => f.type === ControlType.ACTIVITY).length + +1), StepType: '', NextStepId: ''};
    } else if (type === ControlType.CIRCLE) {
      return {Id: this.START, StepType: this.START, NextStepId: ''};
    } else if (type === ControlType.CONDITION) {
      return {Id: 'Condition' + (+activityList.filter(f => f.type === ControlType.CONDITION).length + +1),
              StepType: '',
              NextStepId: '', Inputs: { Condition : ''} , Do: []};
    }
  }

  makeJsonForWorkflowEngine(activityList: IDataModel[], id: string, dataType: string): IWorkflow {
      const workflowJSON: IWorkflow = { Id: id, DataType: dataType, Version: '1', Steps: [] };

      // find start step by filterring 'Start'
      const nextStepId: number[] = activityList.find(a => a.data.StepType === this.START).nextId;

      // continue finding till last step
      const parsedSteps: IWorkflowStep[] = this.iterateActivityList(nextStepId, activityList);

      workflowJSON.Steps = (parsedSteps);

      return workflowJSON;
  }


  getStepName(activityList: IDataModel[], nextId: number[]): string {
    if (nextId.length) {
      // tslint:disable-next-line:triple-equals
      const step = activityList.find(f => f.id == nextId[0]);
      return step && this.REQUIRED_STEP_TYPES.includes(step.type) ? step.data.Id : '';
    }
    return '';
  }


  iterateActivityList(nextStepId: number[], activityList: IDataModel[]): IWorkflowStep[] {
    const workflowSteps: IWorkflowStep[] = [];
    while (nextStepId.length) {
      // tslint:disable-next-line:triple-equals
      const step = activityList.find(a => a.id == nextStepId[0]);
      if (this.REQUIRED_STEP_TYPES.includes(step.type)) {
        if (step.type === ControlType.ACTIVITY) {
          step.data.NextStepId = this.getStepName(activityList, step.nextId);
          step.isSelected = false;
          workflowSteps.push(step.data);

          nextStepId = step.nextId;
        } else if (step.type === ControlType.CONDITION) {
          // tslint:disable-next-line:triple-equals
          step.data.NextStepId = this.getStepName(activityList, step.nextId.filter(f => f != step.conditionYesId[0]));
          step.isSelected = false;
          // tslint:disable-next-line:triple-equals
          step.data.Do.push(this.iterateActivityList(step.conditionYesId, activityList));
          workflowSteps.push(step.data);
          // assign the nextId to else condition
          nextStepId = step.nextId.filter(f => f !== step.conditionYesId[0]);
        }
      } else {
        nextStepId = [];
      }
    }
    return workflowSteps;
  }

  refreshConditionDoList(activityList: IDataModel[]): IDataModel[] {
    activityList.forEach(val => {
      if (val.type === ControlType.CONDITION) {
        val.data.Do = [];
      }
    });
    return activityList;
  }

  validateWorkflow(activityList: IDataModel[]): string {
    let errorMessage = '';
    if (activityList.filter(f => f.data.Id === this.START).length > 1) {
      return 'More than one Start control can not present !';
    } else if (activityList.filter(f => f.data.Id === this.END).length === 0) {
      return 'End control is not available !';
    }
    activityList.forEach(f => {
      if (f.type === ControlType.ACTIVITY && !f.data.StepType) {
        errorMessage = 'No property set to control ' + f.data.Id;
        return;
      }
    });
    if (!errorMessage) {
      activityList.forEach(f => {
        if (f.type === ControlType.CONDITION) {
          if (!f.data.StepType) {
            errorMessage = 'No StepType set to control ' + f.data.Id;
            return;
          } else if (f.data.Inputs && !f.data.Inputs.Condition) {
            errorMessage = 'No condition expression set to control ' + f.data.Id;
            return;
          } else if (!f.conditionYesId.length || !f.nextId.length) {
            errorMessage = 'Either link Yes/No of control ' + f.data.Id;
            return;
          }
        }
      });
    }
    return errorMessage;
  }

  collectInputParams(activityList: IDataModel[]): Set<any> {
    const inputList = new Set<any>();
    activityList.forEach(a => {
      if (a.type === ControlType.ACTIVITY && a.data.Inputs && Object.keys(a.data.Inputs).length > 0) {
        Object.keys(a.data.Inputs).forEach(key => {
          if (key !== 'message') {
            inputList.add({ key: key, value: ''});
          }
        });
      }
    });
    return inputList;
  }

  getConectionStartPoint(control: string, cordinates: any, fromDirection: string,
    height: number, width: number): {x: number, y: number} {
      switch (fromDirection) {
        case 'left':
          return this.getLeftConnection(control, cordinates, height, width);
        case 'right':
          return this.getRightConnection(control, cordinates, height, width);
        case 'up':
          return this.getUpConnection(control, cordinates, height, width);
        case 'down':
          return this.getDownConnection(control, cordinates, height, width);
      }
  }

  getHeightAndWidthOfControl(type: string): { height: number, width: number} {
    const control = function (height, width) {
      return { height: height, width: width};
    };
    let data = null;
    switch (type) {
      case ControlType.ACTIVITY:
        data = control(50, 150);
      break;
      case ControlType.CIRCLE:
        data = control(40, 80);
      break;
      case ControlType.CONDITION:
        data = control(100, 100);
      break;
    }

    return data;
  }

  getLeftConnection(controlType: string, controlCordinates: {x: number, y: number}, height: number, width: number)
                  : {x: number, y: number} {
    const cordinate = {x: 0, y: 0};
    switch (controlType) {
      case ControlType.ACTIVITY:
        cordinate.x = +controlCordinates.x;
        cordinate.y = +controlCordinates.y + +(height / 2);
      break;
      case ControlType.CIRCLE:
        cordinate.x = +controlCordinates.x - (width / 2);
        cordinate.y = controlCordinates.y ;
      break;
      case ControlType.CONDITION:
        cordinate.x = +controlCordinates.x - (width / 2);
        cordinate.y = controlCordinates.y ;
      break;
    }
    return cordinate;
  }

  getRightConnection(controlType: string, controlCordinates: {x: number, y: number}, height: number, width: number)
                  : {x: number, y: number} {
    const cordinate = {x: 0, y: 0};
    switch (controlType) {
      case ControlType.ACTIVITY:
        cordinate.x = +controlCordinates.x + +width;
        cordinate.y = +controlCordinates.y + +(height / 2);
      break;
      case ControlType.CIRCLE:
        cordinate.x = +controlCordinates.x + + (width / 2);
        cordinate.y = controlCordinates.y;
      break;
      case ControlType.CONDITION:
        cordinate.x = +controlCordinates.x + +(width / 2);
        cordinate.y = controlCordinates.y;
      break;
    }
    return cordinate;
  }

  getDownConnection(controlType: string, controlCordinates: {x: number, y: number}, height: number, width: number)
                  : {x: number, y: number} {
    const cordinate = {x: 0, y: 0};
    switch (controlType) {
      case ControlType.ACTIVITY:
        cordinate.x = +controlCordinates.x + +(width / 2);
        cordinate.y = +controlCordinates.y + +height;
      break;
      case ControlType.CIRCLE:
        cordinate.x = controlCordinates.x;
        cordinate.y = +controlCordinates.y + + (height / 2);
      break;
      case ControlType.CONDITION:
        cordinate.x = +controlCordinates.x;
        cordinate.y = +controlCordinates.y + +(height / 2);
      break;
    }
    return cordinate;
  }

  getUpConnection(controlType: string, controlCordinates: {x: number, y: number}, height: number, width: number)
                  : {x: number, y: number} {
    const cordinate = {x: 0, y: 0};
    switch (controlType) {
      case ControlType.ACTIVITY:
        cordinate.x = +controlCordinates.x + + (width / 2);
        cordinate.y = +controlCordinates.y;
      break;
      case ControlType.CIRCLE:
        cordinate.x = controlCordinates.x;
        cordinate.y = controlCordinates.y - (height / 2);
      break;
      case ControlType.CONDITION:
        cordinate.x = controlCordinates.x;
        cordinate.y = controlCordinates.y - (height / 2);
      break;
    }
    return cordinate;
  }


}
