import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ScreenSize {
  small,
  medium,
  large,
}

@Injectable({ providedIn: 'root' })
export class ScreenService {
  public currentScreenSize = new BehaviorSubject<ScreenSize>(ScreenSize.large);
  public isScrollAtBottom = new BehaviorSubject<boolean>(false);

  constructor() {
    window.addEventListener('resize', () => {
      const currentScreenType = this.getScreenType();
      if (this.currentScreenSize.value !== currentScreenType)
        this.currentScreenSize.next(currentScreenType);
    });

    window.addEventListener('scroll', async () => {
      const isScrollAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        window.innerHeight + window.scrollY >
          (window.visualViewport?.height ?? 0) + 100;
      if (isScrollAtBottom !== this.isScrollAtBottom.value) {
        this.isScrollAtBottom.next(isScrollAtBottom);
      }
    });
  }

  private getScreenType(): ScreenSize {
    const width = window.innerWidth;
    if (width < 768) {
      return ScreenSize.small;
    } else if (width >= 768 && width < 1000) {
      return ScreenSize.medium;
    } else {
      return ScreenSize.large;
    }
  }
}
