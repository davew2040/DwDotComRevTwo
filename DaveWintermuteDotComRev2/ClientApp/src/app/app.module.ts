import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { ROUTES } from './app.routes';
import { ResumeComponent } from './components/resume/resume.component';
import { LinksComponent } from './components/links/links.component';
import { PointDrawingComponent } from './components/point-drawing/point-drawing.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LinksComponent,
    ResumeComponent,
    PointDrawingComponent,
    FooterComponentComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
