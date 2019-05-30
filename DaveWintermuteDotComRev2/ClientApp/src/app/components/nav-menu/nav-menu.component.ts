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

  public navigateToHome() {
    this.router.navigate(['/' + RoutePaths.Home]);
  }

  public navigateToLinks() {
    this.router.navigate(['/' + RoutePaths.Links]);
  }

  public navigateToResume() {
    this.router.navigate(['/' + RoutePaths.Resume]);
  }
}
