import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys', pure: false})
export class Keys implements PipeTransform {
  transform(value: any, args?: any[]): any {
    const keys = [];
    if (Object.keys(value).length) {
      Object.keys(value).forEach((i, index) => keys.push({index: index + 1, key: i, value: value[i]}));
    }
    return keys;
  }
}
