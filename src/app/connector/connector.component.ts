import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ControlType } from '../control-type/controlType';
import { ConnectionService } from '../services/connection.service';
import { UtililtyService } from '../services/utililty.service';

@Component({
  selector: '[app-connector]',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.css']
})
export class ConnectorComponent implements OnInit, OnChanges {

  @Input() height: number;
  @Input() width: number;
  @Input() controlType: string;
  @Input() controlId: number;
  @Input() controlCordinates: any;

  leftPosition: string;
  upPosition: string;
  rightPosition: string;
  downPosition: string;

  constructor(private connectService: ConnectionService,
              private utility: UtililtyService) { }

  ngOnInit() {
    this.makeConnectorPosition();
  }

  ngOnChanges(changes: any): void {
    if (changes.controlCordinates.currentValue !== changes.controlCordinates.previousValue) {
      this.makeConnectorPosition();
    }
  }


  makeConnectorPosition() {
    switch (this.controlType) {
      case ControlType.CIRCLE:
        this.upPosition = this.controlCordinates.x + ' ' + (this.controlCordinates.y - 35) + ','
                          + (this.controlCordinates.x - 5) + ' ' + (this.controlCordinates.y - 25) + ','
                          + (+this.controlCordinates.x + +5) + ' ' + (this.controlCordinates.y - 25);
        this.leftPosition = (this.controlCordinates.x - 55) + ' ' + this.controlCordinates.y + ','
                          + (this.controlCordinates.x - 45) + ' ' + (this.controlCordinates.y - 5) + ','
                          + (this.controlCordinates.x - 45) + ' ' + (+this.controlCordinates.y + +5);
        this.downPosition = (this.controlCordinates.x) + ' ' + (+this.controlCordinates.y + +35) + ','
                          + (this.controlCordinates.x - 5) + ' ' + (+this.controlCordinates.y + +25) + ','
                          + (+this.controlCordinates.x + +5) + ' ' + (+this.controlCordinates.y + +25);
        this.rightPosition = (+this.controlCordinates.x + +55) + ' ' + (this.controlCordinates.y) + ','
                          + (+this.controlCordinates.x + +45) + ' ' + (this.controlCordinates.y - 5) + ','
                          + (+this.controlCordinates.x + +45) + ' ' + (+this.controlCordinates.y + +5);
        break;
      case ControlType.ACTIVITY:
        this.upPosition = (+this.controlCordinates.x + +75) + ' ' + (this.controlCordinates.y - 15) + ','
                          + (+this.controlCordinates.x + +70) + ' ' + (this.controlCordinates.y - 5) + ','
                          + (+this.controlCordinates.x + +80) + ' ' + (this.controlCordinates.y - 5);
        this.leftPosition = (this.controlCordinates.x - 15) + ' ' + (+this.controlCordinates.y + +25) + ','
                          + (this.controlCordinates.x - 5) + ' ' + (+this.controlCordinates.y + +20) + ','
                          + (this.controlCordinates.x - 5) + ' ' + (+this.controlCordinates.y + +30);
        this.downPosition = (+this.controlCordinates.x + +75) + ' ' + (+this.controlCordinates.y + +65) + ','
                          + (+this.controlCordinates.x + +70) + ' ' + (+this.controlCordinates.y + +55) + ','
                          + (+this.controlCordinates.x + +80) + ' ' + (+this.controlCordinates.y + +55);
        this.rightPosition = (+this.controlCordinates.x + +165) + ' ' + (+this.controlCordinates.y + +25) + ','
                          + (+this.controlCordinates.x + +155) + ' ' + (+this.controlCordinates.y + +20) + ','
                          + (+this.controlCordinates.x + +155) + ' ' + (+this.controlCordinates.y + +30);
        break;
      case ControlType.CONDITION:
        this.rightPosition = (+this.controlCordinates.x + +65) + ' ' + this.controlCordinates.y + ','
                          + (+this.controlCordinates.x + +60) + ' ' + (this.controlCordinates.y - 15) + ','
                          + (+this.controlCordinates.x + +60) + ' ' + (+this.controlCordinates.y + +15);
        this.downPosition = this.controlCordinates.x + ' ' + (+this.controlCordinates.y + +65) + ','
                          + (this.controlCordinates.x - 15) + ' ' + (+this.controlCordinates.y + +60) + ','
                          + (+this.controlCordinates.x + +15) + ' ' + (+this.controlCordinates.y + +60);
        break;
    }
  }

  startConnection(direction: string) {
    const startpoint = this.utility.getConectionStartPoint(this.controlType, this.controlCordinates, direction, this.height, this.width);
    const control = { type: this.controlType, data: { height: this.height, width: this.width,
                      isConnectionPointFixed: false, id: this.controlId}};
    this.connectService.pushConnectStartPoint({ fromControl: control,
                                                fromDirection: direction, startPoint: startpoint });
  }

}
