import { Component, OnInit } from '@angular/core';
import {
  concatAll,
  filter,
  fromEvent,
  map,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'rxjs';

  ngOnInit(): void {
    this.scrollVideo();
    this.dragVideo();
  }

  /**
   * scrollVideo - 滾動影片
   */
  scrollVideo() {
    // get element
    const video = document.getElementById('video') as HTMLElement;
    const anchor = document.getElementById('anchor') as HTMLElement;
    // set event
    const scroll = fromEvent(document, 'scroll');
    // rx
    scroll
      .pipe(map(() => anchor.getBoundingClientRect().bottom < 0))
      .subscribe((bool) => {
        if (bool) {
          video.classList.add('video-fixed');
          return;
        }
        video.classList.remove('video-fixed');
        return;
      });
  }

  /**
   * dragVideo - 拖拉影片
   */
  dragVideo() {
    // get element
    const video = document.getElementById('video') as HTMLElement;
    // set event
    const mouseDown = fromEvent<MouseEvent>(video, 'mousedown');
    const mouseUp = fromEvent<MouseEvent>(document, 'mouseup');
    const mouseMove = fromEvent<MouseEvent>(document, 'mousemove');
    // rx
    mouseDown
      .pipe(
        filter(() => video.classList.contains('video-fixed')),
        map(() => mouseMove.pipe(takeUntil(mouseUp))),
        concatAll(),
        withLatestFrom(mouseDown, (move, down) => {
          return {
            x: this.validValue(
              move.clientX - down.offsetX,
              window.innerWidth - 320,
              0
            ),
            y: this.validValue(
              move.clientY - down.offsetY,
              window.innerHeight - 180,
              0
            ),
          };
        })
      )
      .subscribe((event) => {
        video.style.top = `${event.y}px`;
        video.style.left = `${event.x}px`;
      });
  }

  /**
   * validValue - 規範最大最小值
   *
   * @param value - number
   * @param max - number
   * @param min - number
   * @returns number
   */
  validValue(value: number, max: number, min: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
