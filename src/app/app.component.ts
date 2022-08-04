import { Component, OnInit } from '@angular/core';
import { concatAll, fromEvent, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'rxjs-pratice';

  ngOnInit(): void {
    const dragDom = document.getElementById('drag');
    const body = document.body;
    if (dragDom && body) {
      const mouseDown = fromEvent<MouseEvent>(dragDom, 'mousedown');
      const mouseUp = fromEvent<MouseEvent>(body, 'mouseup');
      const mouseMove = fromEvent<MouseEvent>(body, 'mousemove');
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
}
