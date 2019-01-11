import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Inject } from '@angular/core';
import { SvgArrowUtilityService } from '../services/svg-arrowUtility.service';
import { ConnectionService } from '../services/connection.service';
import { IDataModel } from '../model/dataModel';

@Component({
  selector: '[app-twodimension-arrow]',
  templateUrl: './twodimension-arrow.component.html',
  styleUrls: ['./twodimension-arrow.component.css']
})
export class TwodimensionArrowComponent implements OnInit, OnChanges {

  @Input() id: number;

  @Input() x1: number;
  @Input() y1: number;

  @Input() x2: number;
  @Input() y2: number;

  @Input() fromDirection: string;
  @Input() pointDirection: string;

  @Input() isSelected: boolean;

  @Input() fromId: number;
  @Input() toId: number;

  @Input() fromControlData: IDataModel;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  linePoints: string;
  arrowPoints: string;
  isDragging = false;

  x_diff = 0;
  y_diff = 0;

  constructor(private svgArrow: SvgArrowUtilityService,
              private connectService: ConnectionService) { }

  ngOnChanges(changes: any): void {
    if (changes.x1) { this.x1 = changes.x1.currentValue; }
    if (changes.y1) { this.y1 = changes.y1.currentValue; }
    if (changes.x2) { this.x2 = changes.x2.currentValue; }
    if (changes.y2) { this.y2 = changes.y2.currentValue; }
    if (changes.isSelected) {
      this.isSelected = changes.isSelected.currentValue;
    }

    this.linePoints = this.svgArrow.CalculateArrowLines(this.x1, this.y1, this.x2, this.y2,
      this.fromDirection, this.pointDirection, null, null);
    this.arrowPoints = this.svgArrow.CalculateArrowPoint(this.x2, this.y2, this.pointDirection, 7);
  }

  ngOnInit() {

    this.linePoints = this.svgArrow.CalculateArrowLines(this.x1, this.y1, this.x2, this.y2,
                                                         this.fromDirection, this.pointDirection, null, null);
    this.arrowPoints = this.svgArrow.CalculateArrowPoint(this.x2, this.y2, this.pointDirection, 7);
  }

  onSelect(event: any) {
    event.stopPropagation();
    this.isSelected = true;
    this.select.emit(this.id);
  }

  moveStart(event: any) {
    const startpoint = { x: this.x1, y: this.y1 };
    const control = { type: this.fromControlData.type, data: { height: this.fromControlData.dimension.height,
                                              width: this.fromControlData.dimension.width,
                                              isConnectionPointFixed: false,
                                              id: this.fromId,
                                              linkId: this.id}};

    this.connectService.pushConnectStartPoint({ fromControl: control,
                                                fromDirection: this.fromDirection, startPoint: startpoint });
  }

}
