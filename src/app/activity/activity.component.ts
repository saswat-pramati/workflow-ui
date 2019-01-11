import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IDraggableControl } from '../interface/IDraggableControl';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-activity]',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnChanges, IDraggableControl {

  @Input() x: number;
  @Input() y: number;
  @Input() height;
  @Input() width;
  @Input() name;
  @Input() stepname;

  @Input() id: number;
  @Input() isSelected: boolean;
  @Input() nextId: number[];


  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() position: EventEmitter<any> = new EventEmitter<any>();

  isDragging = false;
  x_diff = 0;
  y_diff = 0;



  connectorCordinate: any;

  isHovered = false;

  constructor() {

  }

  ngOnInit() {
    this.connectorCordinate = {x: this.x, y: this.y};

  }

  ngOnChanges(changes: any) {
    if (changes.isSelected && (changes.isSelected.currentValue !== changes.isSelected.previousvalue)) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }

    this.connectorCordinate = {x: this.x, y: this.y};
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
      this.position.emit({x: this.x, y: this.y});
    }
  }

  dragEnd() {
    this.isDragging = false;
    this.position.emit({x: this.x, y: this.y});
  }

}
