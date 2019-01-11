import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subaction',
  templateUrl: './subaction.component.html',
  styleUrls: ['./subaction.component.css']
})
export class SubactionComponent implements OnInit {

  @Output() move: EventEmitter<any> = new EventEmitter<any>();

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  @Output() toggleUnDo: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onMove(direction: string) {
    this.move.emit(direction);
  }

  onDelete() {
    this.delete.emit();
  }

  onDo(action: string) {
    this.toggleUnDo.emit(action);
  }


}
