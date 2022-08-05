import { Component, OnInit } from '@angular/core';
import { concatAll, fromEvent, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'rxjs';

  ngOnInit(): void {
    this.drag();
  }

  /**
   * drag - 拖拉方塊事件
   */
  drag() {
    // get element
    const dragDom = document.getElementById('drag') as HTMLElement;
    const body = document.body;
    // set event
    const mouseDown = fromEvent<MouseEvent>(dragDom, 'mousedown');
    const mouseUp = fromEvent<MouseEvent>(body, 'mouseup');
    const mouseMove = fromEvent<MouseEvent>(body, 'mousemove');
    // rxjs drag
    mouseDown
      .pipe(
        map(() => mouseMove.pipe(takeUntil(mouseUp))),
        concatAll()
      )
      .subscribe((event) => {
        dragDom.style.left = `${event.clientX}px`;
        dragDom.style.top = `${event.clientY}px`;
      });
  }
}
