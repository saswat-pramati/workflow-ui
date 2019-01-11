import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SvgArrowUtilityService } from '../services/svg-arrowUtility.service';

@Component({
  selector: '[app-virtual-arrow]',
  templateUrl: './virtual-arrow.component.html',
  styleUrls: ['./virtual-arrow.component.css']
})
export class VirtualArrowComponent implements OnInit, OnChanges {

  @Input() x1: number;
  @Input() y1: number;
  @Input() x2: number;
  @Input() y2: number;
  // @Input() points: string;
  @Input() pointDirection: string;
  @Input() isSelected: boolean;

  linePoints: string;
  // arrowPoints: string;

  constructor(private svgArrow: SvgArrowUtilityService) { }

  ngOnInit() {
    this.linePoints = this.svgArrow.CalculatePolyLinePoints(this.x1, this.y1, this.x2, this.y2);
    // this.arrowPoints = this.svgArrow.CalculateArrowPoint(this.x2, this.y2, this.pointDirection, 10);
  }

  ngOnChanges(changes: any): void {
    if (changes.x1) { this.x1 = changes.x1.currentValue; }
    if (changes.y1) { this.y1 = changes.y1.currentValue; }
    if (changes.x2) { this.x2 = changes.x2.currentValue; }
    if (changes.y2) { this.y2 = changes.y2.currentValue; }

    // this.linePoints = this.svgArrow.CalculatePolyLinePoints(this.x1, this.y1, this.x2, this.y2);
    this.linePoints = this.svgArrow.drawConnection({ type: 'activity'}, this.pointDirection, this.x1, this.y1, this.x2, this.y2);
    // this.arrowPoints = this.svgArrow.CalculateArrowPoint(this.x2, this.y2, this.pointDirection, 10);
  }

}
