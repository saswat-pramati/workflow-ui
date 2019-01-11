import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ControlType } from '../control-type/controlType';
import { ConnectionService } from '../services/connection.service';
import { UtililtyService } from '../services/utililty.service';

@Component({
  selector: '[app-receiver]',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css']
})

export class ReceiverComponent implements OnInit, OnChanges {

  @Input() controlType: string;
  @Input() controlId: number;
  @Input() controlCordinates: any;
  @Input() height: number;
  @Input() width: number;


  cordinate: any = { left: {x: 0, y: 0}, up: {x: 0, y: 0}, right: {x: 0, y: 0}, down: {x: 0, y: 0} };

  constructor(private connectionService: ConnectionService, private utility: UtililtyService) {
  }

  ngOnInit() {
    this.makeCordinates();
  }

  ngOnChanges(changes: any): void {
    if (changes.controlCordinates.currentValue !== changes.controlCordinates.previousValue) {
      this.makeCordinates();
    }
  }

  makeCordinates() {
    this.cordinate.up = this.utility.getUpConnection(this.controlType, this.controlCordinates, this.height, this.width);
    this.cordinate.left = this.utility.getLeftConnection(this.controlType, this.controlCordinates, this.height, this.width);
    if (this.controlType !== ControlType.CONDITION) {
      this.cordinate.right = this.utility.getRightConnection(this.controlType, this.controlCordinates, this.height, this.width);
      this.cordinate.down = this.utility.getDownConnection(this.controlType, this.controlCordinates, this.height, this.width);
    }

  }


  connectionArrive(cordinates, direction) {
    const data = { control: this.controlType, endPoint: cordinates, id: this.controlId, direction: direction };
    this.connectionService.pushReceiverPoint(data);
  }

}
