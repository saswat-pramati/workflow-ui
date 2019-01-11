import { Injectable } from '@angular/core';
import { ControlType } from '../control-type/controlType';
import { IDataModel } from './../model/dataModel';
import { UtililtyService } from './utililty.service';

@Injectable({
  providedIn: 'root'
})
export class SvgArrowUtilityService {

  constructor(private utility: UtililtyService) { }

  public CalculateArrowPoint(x: number, y: number, direction: string, arrowWidth: number): string {
    let points = '';
    points = x + ' ' + y + ',';

    if (direction === 'down') {
      points += (x - arrowWidth) + ' ' + (y - arrowWidth) + ',';
      points += (+x + +arrowWidth) + ' ' + (y - arrowWidth);
    } else if (direction === 'right') {
      points += (x - arrowWidth) +  ' ' + (y - arrowWidth) + ',';
      points += (x - arrowWidth) + ' ' + (+y + +arrowWidth);
    } else if (direction === 'left') {
      points += (+x + +arrowWidth) + ' ' + (y - arrowWidth) + ',';
      points += (+x + +arrowWidth) + ' ' + (+y + +arrowWidth);
    } else if (direction === 'up') {
      points += (x - arrowWidth) + ' ' + (+y + +arrowWidth) + ',';
      points += (+x + +arrowWidth) + ' ' + (+y + +arrowWidth);
    }
    return points;
  }

  public CalculateArrowFromPoint(x: number, y: number, controlType: string,
                                controlDimension: {height: number, width: number},
                                direction: string, linkCordinate: any): {x: number, y: number} {
    if (direction === 'left') {
      return this.utility.getLeftConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    } else if (direction === 'right') {
      return this.utility.getRightConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    } else if (direction === 'down') {
      return this.utility.getDownConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    }  else if (direction === 'up') {
      return this.utility.getUpConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    }
  }

  public CalculateArrowToPoint(x: number, y: number, controlType: string,  controlDimension: {height: number, width: number},
                              toDirection: string, linkCordinate: any): {x: number, y: number} {

    if (toDirection === 'right') {
      return this.utility.getLeftConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    } else if (toDirection === 'left') {
      return this.utility.getRightConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    } else if (toDirection === 'up') {
      return this.utility.getDownConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    }  else if (toDirection === 'down') {
      return this.utility.getUpConnection(controlType, {x: x, y: y}, controlDimension.height, controlDimension.width);
    }
  }

  public CalculatePolyLinePoints(x1: number, y1: number, x2: number, y2: number): string {
    let points = x1 + ' ' + y1 + ',';

    if (x2 !== x1 && y2 > y1) {
      const ym = (+y1 + +y2) / 2;
      points += x1 + ' ' + ym + ',';
      points += x2 + ' ' + ym + ',';
    } else if (x2 !== x1 && y2 < y1) {
      const xm = Math.ceil((+x1 + +x2) / 2);
      points += x1 + ' ' + (+y1 + +20) + ',';
      points += xm + ' ' + (+y1 + +20) + ',';
      points += xm + ' ' + (y2 - 20) + ',';
      points += x2 + ' ' + (y2 - 20) + ',';
    }

    return points + x2 + ' ' + y2;
  }

  public CalculateArrowLines(x1: number, y1: number, x2: number, y2: number, fromDir: string,
                              toDir: string, fromControlRange: any, toControlRange: any): string {
    let points = x1 + ' ' + y1 + ',';

    switch (fromDir) {
      case 'right':
        if (toDir === 'right') {
          points += (+x1 + +x2) / 2 + ' ' + y1 + ',';
          points += (+x1 + +x2) / 2 + ' ' + y2 + ',';
        } else if (toDir === 'down' || toDir === 'up') {
          points += x2 + ' ' + y1 + ',';
        }
      break;
      case 'down':
        if (toDir === 'down') {
          points += x1 + ' ' + (+y1 + +y2) / 2 + ',';
          points += x2 + ' ' + (+y1 + +y2) / 2 + ',';
        } else if (toDir === 'left' || toDir === 'right') {
          points += x1 + ' ' + y2 + ',';
        }
      break;
      case 'left':
        if (toDir === 'left') {
          points += (+x1 + +x2) / 2 + ' ' + y1 + ',';
          points += (+x1 + +x2) / 2 + ' ' + y2 + ',';
        } else if (toDir === 'down' || toDir === 'up') {
          points += x2 + ' ' + y1 + ',';
        }
      break;
      case 'up':
        if (toDir === 'up') {
          points += x1 + ' ' + (+y1 + +y2) / 2 + ',';
          points += x2 + ' ' + (+y1 + +y2) / 2 + ',';
        } else if (toDir === 'left' || toDir === 'right') {
          points += x1 + ' ' + y2 + ',';
        }
      break;
    }

    return points + x2 + ' ' + y2;
  }

  public drawConnection(fromControl: any, fromDirection: string,
                        x1: number, y1: number, x2: number, y2: number): string {
    let points = x1 + ' ' + y1 + ',';

    switch (fromControl.type) {
      case ControlType.CIRCLE:
        switch (fromDirection) {
          case 'left':
            if (y2 !== y1) {
              points += x2 + ' ' + y1 + ',';
            }
          break;
          case 'right':
            if (y2 !== y1) {
              points += x2 + ' ' + y1 + ',';
            }
          break;
          case 'up':
            if (y2 !== y1) {
              points += x1 + ' ' + y2 + ',';
            }
          break;
          case 'down':
            if (x2 !== x1) {
              points += x1 + ' ' + (+y2 + +y1) / 2 + ',';
              points += x2 + ' ' + (+y2 + +y1) / 2 + ',';
            }
          break;
        }
      break;
      case ControlType.ACTIVITY:
      switch (fromDirection) {
        case 'left':
          if (y2 !== y1) {
            points += x2 + ' ' + y1 + ',';
          }
        break;
        case 'right':
          if (y2 !== y1) {
            points += x2 + ' ' + y1 + ',';
          }
        break;
        case 'up':
          if (y2 !== y1) {
            points += x1 + ' ' + (+y2 + +y1) / 2 + ',';
            points += x2 + ' ' + (+y2 + +y1) / 2 + ',';
          }
        break;
        case 'down':
          if (x2 !== x1) {
            // points += x1 + ' ' + y2 + ',';
            points += x1 + ' ' + (+y2 + +y1) / 2 + ',';
            points += x2 + ' ' + (+y2 + +y1) / 2 + ',';
          }
        break;
      }
      break;
    }

    return points + x2 + ' ' + y2;
  }

  calculateStartPointBasedOnDrag(mouseX: number, mouseY: number, prevX: number, prevY: number, direction: string, controlData: any):
                    {nextX: number, nextY: number, direction: string} {
    if (!controlData.isConnectionPointFixed) {
      const breakWidth = controlData.width / 2;
      const breakHeight = controlData.height / 2;

      if (direction === 'down') {
        if (mouseY > prevY) {
          if (mouseX > +prevX + +breakWidth) {
            return { nextX: +prevX + +breakWidth, nextY: prevY - breakHeight, direction: 'right'};
          } else if (mouseX < prevX - breakWidth) {
            return { nextX: prevX - breakWidth, nextY: prevY - breakHeight, direction: 'left'};
          }
        } else if (mouseY < prevY - controlData.height) {
          return { nextX: prevX , nextY: prevY - controlData.height, direction: 'up'};
        }
      } else if (direction === 'left') {
        if (mouseX > prevX) {
          if (mouseY > prevY) {
            return { nextX: +prevX + +breakWidth, nextY: +prevY + +breakHeight, direction: 'down'};
          } else {
            return { nextX: +prevX + +breakWidth, nextY: prevY - breakHeight, direction: 'up'};
          }
        }

      } else if (direction === 'right') {
        if (mouseX < prevX) {
          if (mouseY > prevY) {
            return { nextX: prevX - breakWidth, nextY: +prevY + +breakHeight, direction: 'down'};
          } else  {
            return { nextX: prevX - breakWidth, nextY: prevY - breakHeight, direction: 'up'};
          }
        }
      } else if (direction === 'up') {
        if (mouseY < prevY) {
          if (mouseX > +prevX + +breakWidth) {
            return { nextX: +prevX + +breakWidth, nextY: +prevY + +breakHeight, direction: 'right'};
          } else if (mouseX < prevX - breakWidth) {
            return { nextX: prevX - breakWidth, nextY: +prevY + +breakHeight, direction: 'left'};
          }
        } else if (mouseY < +prevY + +controlData.height) {
          return { nextX: prevX , nextY: +prevY + +controlData.height, direction: 'down'};
        }
      }
    }
    return null;
  }

}
