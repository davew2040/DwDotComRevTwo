import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from 'src/app/angular/route-paths';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {
  constructor(private router: Router) {

  }

  ngOnInit(): void {

  }

  public navigateToPrintResume() {
    this.router.navigate([{outlets: {'printLayoutOutlet': ['printlayout']}}]);
  }
}
