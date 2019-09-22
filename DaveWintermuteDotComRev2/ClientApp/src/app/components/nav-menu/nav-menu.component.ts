import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from 'src/app/angular/route-paths';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  constructor(private router: Router)
  {
  }

  public navigateToUpdates() {
    this.router.navigateByUrl('/' + RoutePaths.Update);
  }

  public navigateToLinks() {
    this.router.navigateByUrl('/' + RoutePaths.Links);
  }

  public navigateToResume() {
    this.router.navigateByUrl('/' + RoutePaths.Resume);
  }
}
