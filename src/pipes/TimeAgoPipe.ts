import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(value).getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
    if (daysAgo === 0) return 'Published today';
    else return `Published ${daysAgo} days ago`;
  }
}
