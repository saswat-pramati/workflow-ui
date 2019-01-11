import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IDraggableControl } from '../interface/IDraggableControl';


@Component({
  selector: '[app-startend]',
  templateUrl: './startend.component.html',
  styleUrls: ['./startend.component.css']
})
export class StartendComponent implements OnInit, OnChanges, IDraggableControl {

  @Input() id: number;
  @Input() x: number;
  @Input() y: number;
  @Input() rx: number;
  @Input() ry: number;
  @Input() text;
  @Input() isSelected: boolean;
  @Input() nextId: number[];
  @Input() name: string;
  @Input() height: number;
  @Input() width: number;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() position: EventEmitter<any> = new EventEmitter<any>();


  connector_cordinates: string;

  selectX: number;
  selectY: number;
  isDragging = false;


  connectorCordinate: any;

  isHovered = false;

  x_diff = 0;
  y_diff = 0;

  constructor() {
  }

  ngOnInit() {
    this.connectorCordinate = {x: this.x, y: this.y};

  }

  ngOnChanges(changes: any) {
    if (changes.isSelected && (changes.isSelected.currentValue !== changes.isSelected.previousvalue)) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }
    if (changes.nextId && (changes.nextId.currentValue !== changes.nextId.previousValue)) {
      this.nextId = changes.nextId.currentValue;
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
