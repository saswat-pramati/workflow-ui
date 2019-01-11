import { Component, OnInit, HostListener, TemplateRef, OnDestroy, Inject, ViewChild  } from '@angular/core';
import { IDataModel, ILinkModel, IWorkflowRecord, IWorkflow, IWorkFlowReadRecords } from '../model/dataModel';
import { ControlType } from '../control-type/controlType';
import { UtililtyService } from './../services/utililty.service';
import { ApiClientService } from './../apiclient/api-client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventServiceService } from './../services/event-service.service';
import { SvgArrowUtilityService } from './../services/svg-arrowUtility.service';
import { timer } from 'rxjs';
import { environment } from './../../environments/environment';
import { StateService } from '../services/state.service';
import { ConnectionService } from '../services/connection.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit, OnDestroy {

  @ViewChild('runModal') private runModal;
  @ViewChild('saveModal') private saveModal;

  // selected data
  selectedControlData: IDataModel;
  selectedLinkData: ILinkModel;

  // selected control
  selectedControlFromBar: string;
  selectedControlonGraph: boolean;

  // data list
  existingWorkflows: IWorkFlowReadRecords[];
  activityList: IDataModel[] = [];
  linkList: ILinkModel[] = [];
  // workflowId: any;
  inputList: any[];
  selectedWorkFlow: IWorkFlowReadRecords;

  // isEditMode = false;
  showSuccessImage = false;
  showLoadingImage = false;

  // virtualLink: IConnectionType = null;
  errorMessage = null;

  // modal window
  public modalRef: BsModalRef;

  drawingLink: any = null;


  constructor(@Inject(SvgArrowUtilityService) private svgArrow: SvgArrowUtilityService,
              @Inject(UtililtyService) private utility: UtililtyService,
              private database: ApiClientService,
              private modalService: BsModalService,
              private eventService: EventServiceService,
              private state: StateService,
              private connection: ConnectionService) { }

  ngOnInit() {
    // Subscribed RUN button click event
    this.eventService.runEvent.subscribe(event => {
      if (event) {
        this.runWorkflowModal();
      }
    });

    // Subscribed SAVE button click event
    this.eventService.intimateClickSave.subscribe(event => {
      if (event) {
        this.openSaveModal(this.saveModal);
      }
    });

    // NEW CODE
    // Subscribed connection start event
    this.connection.connect.subscribe(event => {
      console.log('started connection from ' + JSON.stringify(event));
      this.drawingLink = { x1: event.startPoint.x, y1: event.startPoint.y, x2: 0, y2: 0,
        fromDirection: event.fromDirection, control: event.fromControl.data };
    });

    // Subscribed connection end event
    this.connection.receive.subscribe(event => {
      // console.log('end connection on ' + JSON.stringify(event));
      if (this.drawingLink) {
        this.connectLink(this.drawingLink, event);
      }
    });
  }

  connectLink(from, to) {
    if (from.control.id !== to.id) {

      // remove if it is existing link
      if (from.control.linkId) {
        this.linkList.splice(this.linkList.findIndex(l => l.id === from.control.linkId), 1);
      }
      // tslint:disable-next-line:triple-equals
      const fromControl = this.activityList.find(f => f.id == from.control.id);
      fromControl.nextId.push(to.id);
      if (from.control.isConditionYesId) { fromControl.conditionYesId.push(to.id); }
      const nextLinkId = this.linkList.length ? Math.max.apply(Math, this.linkList.map(l => l.id)) + 1 : 1;
      const linkObj: ILinkModel = {id: nextLinkId,
                                  fromId: from.control.id,
                                  toId: to.id,
                                  cordinate: {x1: from.x1, y1: from.y1, x2: to.endPoint.x, y2: to.endPoint.y },
                                  fromDirection: from.fromDirection,
                                  toDirection: to.direction,
                                  isSelected: false,
                                  fromControlData: fromControl};

      this.linkList.push(linkObj);
      // this.virtualLink = null;
      this.drawingLink = null;
      this.state.saveState(this.activityList, this.linkList);
    }
  }



  ngOnDestroy(): void {
    this.eventService.runEvent.unsubscribe();
    this.eventService.intimateClickSave.unsubscribe();
    this.connection.connect.unsubscribe();
    this.connection.receive.unsubscribe();
  }


  selectControlFromToolBar(type: string) {
    this.unSelectAllControl();
    this.unSelectAllLinks();
    this.selectedControlFromBar = type;
  }

  onDrop(event: any) {
    this.selectedControlFromBar = event.dataTransfer.getData('type');
    this.createObject(event);
  }

  createObject(event: any) {
    if (this.selectedControlFromBar) {
      const nextId = this.activityList.length ? Math.max.apply(Math, this.activityList.map(o => o.id)) + 1 : 1;
      const obj: IDataModel = { id: nextId,
                      type: this.selectedControlFromBar,
                      cordinate: {x: event.layerX, y: event.layerY},
                      dimension: this.utility.getHeightAndWidthOfControl(this.selectedControlFromBar),
                      nextId: [],
                      data: this.utility.makeDefaultWorkflowStep(this.selectedControlFromBar, this.activityList),
                      isSelected: true,
                      isMultiConnect: this.selectedControlFromBar === ControlType.CONDITION,
                      conditionYesId: [] };

      this.activityList.push(obj);
      this.selectedControlData = obj;
      this.selectedControlFromBar = '';
      this.selectedControlonGraph = true;
      this.state.saveState(this.activityList, this.linkList);
    } else {
      if (this.selectedControlonGraph) {
        this.unSelectAllControl();
        this.unSelectAllLinks();
        this.selectedControlonGraph = false;
        this.selectedControlData = null;
      } if (this.drawingLink && this.drawingLink.x2) {
        this.drawingLink = null;
      }
    }
  }

  unSelectAllControl() {
    this.activityList.forEach(f => f.isSelected = false);
  }

  unSelectAllLinks() {
    this.linkList.forEach(f => f.isSelected = false);
  }



  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.selectedControlonGraph) {
      if (event.key === 'Delete') {
        this.delete();
      } else {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
        }
        this.onActionMove(event.key);
      }
    }
  }

  delete() {
    const selectedControlIndex = this.activityList.findIndex(f => f.isSelected === true);
        if (selectedControlIndex !== -1) {
            this.deleteControl(selectedControlIndex);
        } else {
          const selectedLinkIndex = this.linkList.findIndex(f => f.isSelected === true);
          if (selectedLinkIndex !== -1) {
            this.deleteLink(selectedLinkIndex);
          }
        }
  }

  onActionToggle(event) {
    if (event === 'undo') {
      this.state.unDo();
    } else {
      this.state.reDo();
    }
    this.activityList = this.state.activityListState[this.state.activityListState.length - 1];
    this.linkList = this.state.linkListState[this.state.linkListState.length - 1];
  }


  onActionMove(direction: string) {
    let selectedControl: IDataModel = null;
    switch (direction) {
      case 'ArrowUp':
        selectedControl = this.activityList.find(f => f.isSelected === true);
        this.onPositionChange(selectedControl.id, {x: selectedControl.cordinate.x,
          y: selectedControl.cordinate.y - environment.keyMovemntSpeed });
      break;
      case 'ArrowDown':
        selectedControl = this.activityList.find(f => f.isSelected === true);
        this.onPositionChange(selectedControl.id, {x: selectedControl.cordinate.x,
           y: +selectedControl.cordinate.y + +environment.keyMovemntSpeed});
      break;
      case 'ArrowLeft':
      selectedControl = this.activityList.find(f => f.isSelected === true);
      this.onPositionChange(selectedControl.id, {x: selectedControl.cordinate.x - environment.keyMovemntSpeed,
         y: selectedControl.cordinate.y});
         break;
      case 'ArrowRight':
      selectedControl = this.activityList.find(f => f.isSelected === true);
      this.onPositionChange(selectedControl.id, {x: +selectedControl.cordinate.x + +environment.keyMovemntSpeed,
         y: selectedControl.cordinate.y});
      break;
    }
  }

  onSelectControl(event: number) {
    if (!this.selectedControlFromBar) {
      this.selectedControlonGraph = true;

      for (let i = 0; i < this.activityList.length; i++) {
        // tslint:disable-next-line:triple-equals
        if (this.activityList[i].id == event) {
          this.activityList[i].isSelected = true;
          this.selectedControlData = this.activityList[i];
        } else {
          this.activityList[i].isSelected = false;
        }
      }
    }
    this.unSelectAllLinks();
  }

  onSelectLink(id: number) {
    this.linkList.forEach(l => {
      this.selectedControlonGraph = true;
      // tslint:disable-next-line:triple-equals
      if (l.id == id) {
        l.isSelected = true;
        this.selectedLinkData = l;
      } else {
        l.isSelected = false;
      }
    });
    this.unSelectAllControl();
  }

  onPositionChange(id: number, event: any) {
    const movingControl = this.activityList.find(i => i.id === id);
    movingControl.cordinate.x = event.x;
    movingControl.cordinate.y = event.y;
    this.updateLinkArrow(movingControl);
  }



  updateLinkArrow(control: IDataModel) {
    // tslint:disable-next-line:triple-equals
    const fromArrow: ILinkModel = this.linkList.find(l => l.fromId == control.id);
    if (fromArrow) {
      this.linkList.forEach(l => {
        // tslint:disable-next-line:triple-equals
        if (l.fromId == control.id) {
          const points = this.svgArrow.CalculateArrowFromPoint(control.cordinate.x,
                                                               control.cordinate.y,
                                                               control.type,
                                                               control.dimension,
                                                               l.fromDirection,
                                                               l.cordinate);
          l.cordinate.x1 = points.x;
          l.cordinate.y1 = points.y;
        }
      });
    }

    // tslint:disable-next-line:triple-equals
    const toArrow: ILinkModel = this.linkList.find(l => l.toId == control.id);
    if (toArrow) {
      this.linkList.forEach(l => {
        // tslint:disable-next-line:triple-equals
        if (l.toId == control.id) {
          const points = this.svgArrow.CalculateArrowToPoint(control.cordinate.x,
                                                             control.cordinate.y,
                                                             control.type,
                                                             control.dimension,
                                                             l.toDirection,
                                                             l.cordinate);
          l.cordinate.x2 = points.x;
          l.cordinate.y2 = points.y;
        }
      });
    }
  }


  drawVirtualLink(event: any) {
    // NEW CODE BELOW
    if (this.drawingLink) {
      this.drawingLink.x2 = event.offsetX;
      this.drawingLink.y2 = event.offsetY;

      // except condition control
      const changedDragStartPoint = this.svgArrow.
                                      calculateStartPointBasedOnDrag(event.offsetX, event.offsetY,
                                                            this.drawingLink.x1, this.drawingLink.y1,
                                                            this.drawingLink.fromDirection,
                                                            this.drawingLink.control);
      if (changedDragStartPoint) {
        this.drawingLink.x1 = changedDragStartPoint.nextX;
        this.drawingLink.y1 = changedDragStartPoint.nextY;
        this.drawingLink.fromDirection = changedDragStartPoint.direction;
      }
    }
  }


  deleteLink(linkIndex: number) {
    const link = this.linkList[linkIndex];
    this.activityList.forEach(a => {
      // tslint:disable-next-line:triple-equals
      if (a.id == link.fromId) {
        a.nextId = this.utility.removeFromArray(a.nextId, link.toId);
      }
    });
    this.linkList.splice(linkIndex, 1);
  }

  deleteControl(controlIndex: number) {
    const control = this.activityList[controlIndex];
    const linkIndexTobeDelete: number[] = [];
    this.linkList.forEach((l, i) => {
      // tslint:disable-next-line:triple-equals
      if (l.toId == control.id || l.fromId == control.id) {
        linkIndexTobeDelete.push(i);
      }
    });

    // delete selected control
    this.activityList.splice(controlIndex, 1);

    // delete associated links connected to deleted control
    while (linkIndexTobeDelete.length) {
      const linkIndex = linkIndexTobeDelete.pop();
      const link = this.linkList[linkIndex];
      this.activityList.forEach(a => {
        // tslint:disable-next-line:triple-equals
        if (a.nextId.includes(link.toId)) {
          a.nextId = this.utility.removeFromArray(a.nextId, link.toId);
          if (a.type === ControlType.CONDITION) {
            a.conditionYesId = [];
          }
        }
      });
      this.linkList.splice(linkIndex, 1);
    }
  }

  onClear() {
    this.activityList = [];
    this.linkList = [];
    this.selectedControlData = null;
    this.selectedLinkData = null;
    this.selectedControlFromBar = null;
    this.selectedWorkFlow = null;
    this.drawingLink = null;
    this.eventService.pushSaveEvent(null);
    this.errorMessage = null;
    this.state.clearState();
    if (this.modalRef) { this.modalRef.hide(); }
  }


  openLoadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.database.getAll().subscribe(res => {
      this.existingWorkflows = res;
    }, err => console.log(err));
  }


  load(val: any) {
    // tslint:disable-next-line:triple-equals
    this.selectedWorkFlow = this.existingWorkflows.find(f => f.id == val);
    this.activityList = this.utility.refreshConditionDoList(JSON.parse(this.selectedWorkFlow.jsonObject).controls);
    this.linkList = JSON.parse(this.selectedWorkFlow.jsonObject).links;
    // this.isEditMode = true;
    this.modalRef.hide();
    this.eventService.pushSaveEvent(this.selectedWorkFlow.name);
  }

  openSaveModal(template: TemplateRef<any>) {
    if (this.activityList.length > 0) {
      const isValid = this.utility.validateWorkflow(this.activityList);
      if (!isValid) {
        this.modalRef = this.modalService.show(template);
      } else {
        alert(isValid);
      }
    }
  }

  save(templateId: any) {
    const activityCloneList: IDataModel[] = JSON.parse(JSON.stringify(this.activityList));
      // activityCloneList = Object.assign(activityCloneList, this.activityList);
      const output: IWorkflow = this.utility.
      makeJsonForWorkflowEngine(activityCloneList, templateId, environment.workflowDataType);

      const dataToSave: IWorkflowRecord = {Name: templateId, JsonObject: JSON.stringify({
        controls: this.activityList,
        links: this.linkList,
        parsedData: output
      })};

      this.database.save(dataToSave).subscribe(res => {
        console.log(res);
        if (res) {
          // this.selectedWorkFlow = { id: res, name: templateId, jsonObject: dataToSave.JsonObject};
          // this.eventService.pushSaveEvent(this.selectedWorkFlow.name);
          this.modalRef.hide();
          // this.isEditMode = false;
          this.showSuccessTimer();
          this.onClear();
        }
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }

  runWorkflowModal() {
    if (this.selectedWorkFlow) {
      // TODO run
      this.inputList = Array.from(this.utility.collectInputParams(this.activityList));
      this.modalRef = this.modalService.show(this.runModal);
    } else {
      alert('Workflow is not saved ! Save before you run');
    }
  }

  executeWorkflow(params: any[]) {
    this.showLoadingImage = true;
    const queryparam = JSON.stringify({ query: JSON.stringify(this.parseInputParamater(params)), Id: this.selectedWorkFlow.id });
    console.log(queryparam);
    this.database.run(queryparam).subscribe(res => {
      this.modalRef.hide();
      this.inputList = [];
      this.showLoadingImage = false;
      this.showSuccessTimer();
      this.errorMessage = null;
    }, err => {
      this.showLoadingImage = false;
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  parseInputParamater(params: any[]): any {
    if (params && params.length) {
      const parsedParams = {};
      params.forEach(i => {
        parsedParams[i.key] = i.value;
      });
      return parsedParams;
    } else {
      return '';
    }
  }

  showSuccessTimer() {
    this.showSuccessImage = true;
    const clock = timer(2000);
    clock.subscribe(() => this.showSuccessImage = false);
  }

  modalHide() {
    this.errorMessage = null;
    this.modalRef.hide();
  }


}
