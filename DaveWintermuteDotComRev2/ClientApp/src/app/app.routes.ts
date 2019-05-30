import { Routes } from '@angular/router';
import { RoutePaths } from './angular/route-paths';
import { HomeComponent } from './components/home/home.component';
import { ResumeComponent } from './components/resume/resume.component';
import { LinksComponent } from './components/links/links.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: RoutePaths.Home, component: HomeComponent },
  { path: RoutePaths.Resume, component: ResumeComponent },
  { path: RoutePaths.Links, component: LinksComponent },
  { path: '**', redirectTo: '' }
];
