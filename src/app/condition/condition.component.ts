import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { IDraggableControl } from '../interface/IDraggableControl';
import { EventServiceService } from '../services/event-service.service';
import { ConnectionService } from '../services/connection.service';
import { UtililtyService } from '../services/utililty.service';
import { ControlType } from '../control-type/controlType';

@Component({
  selector: '[app-condition]',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css']
})
export class ConditionComponent implements OnInit, OnChanges, IDraggableControl {


  points: string;
  @Input() id: number;
  @Input() x: number;
  @Input() y: number;
  @Input() conditionName: string;
  @Input() isSelected: boolean;
  @Input() nextId: number[];
  @Input() name: string;
  @Input() height: number;
  @Input() width: number;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() position: EventEmitter<any> = new EventEmitter<any>();

  isDragging = false;
  x_diff = 0;
  y_diff = 0;

  connectorCordinate: any;

  conditionMenu = { down: 'Yes', right: 'No'};


  yes_connector_cordinates: string;
  no_connector_cordinates: string;
  text_cordinates: {yes: {x: number, y: number }, no: {x: number, y: number }} = { yes: undefined, no: undefined };

  isHovered = false;


  constructor(private eventService: EventServiceService,
              private connectService: ConnectionService,
              private utility: UtililtyService) {

  }

  ngOnChanges(changes: any): void {
    if (changes.isSelected && (changes.isSelected.currentValue !== changes.isSelected.previousvalue)) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }

    this.makeConnectorCordinate(this.x, this.y);
    this.makeTextCordinate(this.x, this.y);
    this.connectorCordinate = {x: this.x, y: this.y};
  }


  ngOnInit() {
    this.connectorCordinate = {x: this.x, y: this.y};
    this.makeConnectorCordinate(this.x, this.y);
    this.makeTextCordinate(this.x, this.y);
  }

  makePoints() {
    const _width = this.height / 2;
    const _height = this.height / 2;
    let coordinates = this.x + ' ' + (this.y - _height) + ',';
    coordinates += (this.x - _width) + ' ' + this.y + ',';
    coordinates += this.x + ' ' + (+this.y + +_height) + ',';
    coordinates += (+this.x + +_width) + ' ' + this.y;
    return coordinates;
  }

  makeConnectorCordinate(x: number, y: number) {
    const firstY: number = +y + +50 + +15;
    this.yes_connector_cordinates = x + ' ' + firstY + ',';
    this.yes_connector_cordinates += (x - 10) + ' ' + (firstY - 10) + ',';
    this.yes_connector_cordinates += (+x + +10) + ' ' + (firstY - 10);

    const noX: number = +x + +50 + +15;
    this.no_connector_cordinates = noX + ' ' + y + ',';
    this.no_connector_cordinates += (noX - 10) + ' ' + (y - 10) + ',';
    this.no_connector_cordinates += (noX - 10) + ' ' + (+y + +10);
  }

  makeTextCordinate(x: number, y: number) {
    const textY = +y + +60;
    const textX = +x + +53;
    this.text_cordinates.yes = {x: x - 30, y: textY};
    this.text_cordinates.no = {x: textX, y: y - 15 };
  }



  onSelect(event: any) {
    event.stopPropagation();
    this.isSelected = true;
    this.select.emit(this.id);
  }

  dragStart(event: any) {
    this.isDragging = true;
    this.x_diff = event.layerX - this.x;
    this.y_diff = event.layerY - this.y;
  }

  drag(event: any) {
    if (this.isDragging) {
      this.x = event.layerX - this.x_diff;
      this.y = event.layerY - this.y_diff;
      this.points = this.makePoints();
      this.makeConnectorCordinate(this.x, this.y);
      this.makeTextCordinate(this.x, this.y);
      this.position.emit({x: this.x, y: this.y});
    }
  }

  dragEnd() {
    this.isDragging = false;
    this.position.emit({x: this.x, y: this.y});
  }


  connectionStart(direction: string, isConditionYes: boolean, event: any) {

    // isConditionYes ? this.eventService.pushLinkEvent({x1: this.x, y1: +this.y + +50, fromId: this.id,
    //                        fromDirection: direction, isConditionYesId: isConditionYes}) :
    //   this.eventService.pushLinkEvent({x1: +this.x + +50, y1: this.y, fromId: this.id,
    //                     fromDirection: direction, isConditionYesId: isConditionYes});
    if (event.which === 1) {
      const startpoint = this.utility.getConectionStartPoint(ControlType.CONDITION,
        {x: this.x, y: this.y},
        direction,
        this.height,
        this.width);

        const control = { type: ControlType.CONDITION, data: { height: this.height, width: this.width,
        isConnectionPointFixed: true, id: this.id,
        isConditionYesId: this.conditionMenu[direction] === 'Yes'}};

        this.connectService.pushConnectStartPoint({ fromControl: control,
        fromDirection: direction, startPoint: startpoint });
    }
  }

  toggleConditionDirection() {
    this.conditionMenu.down = this.conditionMenu.down === 'Yes' ? 'No' : 'Yes';
    this.conditionMenu.right = this.conditionMenu.right === 'Yes' ? 'No' : 'Yes';
  }

}
