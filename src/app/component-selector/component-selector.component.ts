import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[app-component-selector]',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.css']
})
export class ComponentSelectorComponent implements OnInit {

  @Input() id: number;
  @Input() type: string;
  @Input() cordinate: {x: any, y: any};
  @Input() isSelected: boolean;
  @Input() nextId: number[];
  @Input() name: string;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() move: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }


  onSelect(id: any) {
    this.select.emit(id);
  }

  onMove(cordinates: any) {
    this.move.emit(cordinates);
  }

}
