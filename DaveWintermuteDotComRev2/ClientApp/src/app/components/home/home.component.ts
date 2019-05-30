import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {
  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    // const result = this.el.nativeElement.querySelector(".warp-text") as HTMLDivElement;
    // const innerText = result.innerText;
    // result.innerHTML = '';
    // for (let i = 0; i < innerText.length; i++) {
    //   const newStyle = document.createElement('style');
    //   newStyle.innerHTML = `.spreader-item${i} { color: red; display: inline-block; transform: translate(0, -${i*10}px) scale(${1.0-(i/20.0)}); }`;
    //   document.body.appendChild(newStyle);

    //   const element = document.createElement('span');
    //   element.classList.add(`spreader-item${i}`);
    //   element.innerHTML = innerText[i];

    //   result.appendChild(element);
    // }
  }
}
