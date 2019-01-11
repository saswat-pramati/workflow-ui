import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlType } from './../control-type/controlType';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.css']
})
export class ControlBarComponent implements OnInit {

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  CIRCLE = ControlType.CIRCLE;
  ACTIVITY = ControlType.ACTIVITY;
  CONDITION = ControlType.CONDITION;
  ARROW = ControlType.ARROW;

  drag_image: HTMLImageElement;

  constructor() { }

  ngOnInit() {
    this.drag_image = document.createElement('img');
  }

  onClick(control: string) {
    this.select.emit(control);
    this.setDragImage(control);
  }

  drag(event: any, type: string) {
    event.dataTransfer.setDragImage(this.drag_image, 0, 0);
    event.dataTransfer.setData('type', type);
  }

  setDragImage(type: string) {
    switch (type) {
      case this.CIRCLE:
      this.drag_image.src = './../../assets/start.svg';
        break;
      case this.ACTIVITY:
      this.drag_image.src = './../../assets/activity.svg';
        break;
      case this.CONDITION:
      this.drag_image.src = './../../assets/condition.svg';
        break;
    }
  }

}
