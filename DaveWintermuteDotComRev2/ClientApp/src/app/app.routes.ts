import { Routes } from '@angular/router';
import { RoutePaths } from './angular/route-paths';
import { HomeComponent } from './components/home/home.component';
import { ResumeComponent } from './components/resume/resume.component';
import { LinksComponent } from './components/links/links.component';
import { PointDrawingComponent } from './components/point-drawing/point-drawing.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: RoutePaths.Update, component: HomeComponent },
  { path: RoutePaths.Resume, component: ResumeComponent },
  { path: RoutePaths.Links, component: LinksComponent },
  { path: RoutePaths.PointDrawing, component: PointDrawingComponent },
  { path: RoutePaths.PrintLayout, component: ResumeComponent, outlet: 'printLayoutOutlet' },
  { path: '**', redirectTo: '' }
];
