import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { RoutePaths } from './angular/route-paths';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  public showingPrint = false;

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.urlAfterRedirects.includes('(printLayoutOutlet:printlayout')) {
            this.showingPrint = true;
            setTimeout(() => window.print());
          }
          else {
            this.showingPrint = false;
          }
        }
      });
  }
}
