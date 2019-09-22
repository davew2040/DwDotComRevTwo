import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as signalR  from '@aspnet/signalr';
import { p } from '@angular/core/src/render3';
import { PointOutputDto } from './dto/point-output-dto';
import { PointDto } from './dto/point-dto';
import { Utilities } from 'src/app/utilities/misc';

interface Point
{
  x: number;
  y: number;
  id: number;
  width: number;
  color: string;
  opacity: number;
}

@Component({
  selector: 'app-point-drawing-component',
  styleUrls: ['./point-drawing.component.scss'],
  templateUrl: './point-drawing.component.html'
})
export class PointDrawingComponent implements OnInit  {
  private connection: signalR.HubConnection;
  private connectionUp = false;
  private isTouch = false;
  private readonly timers: { [index: number]: number; } = {}

  public points: Array<Point> = [];

  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.connection = new signalR.HubConnectionBuilder().withUrl("/pointHub").build();

    this.isTouch = Utilities.isTouchDevice();

    this.connection.on("PointAdded", (pointDto: PointDto) => {
      this.addPoint(pointDto);
    });

    this.connection.on("PointRemoved", (id: number) => {
      const immediatePointIndex = this.points.findIndex(x => x.id === id);

      if (immediatePointIndex === -1) {
        return;
      }

      this.points[immediatePointIndex].width = 0.0;

      window.setTimeout(() => {
        const delayedPointIndex = this.points.findIndex(x => x.id === id);

        this.points.splice(delayedPointIndex, 1);
      }, 2000);
    });

    this.connection.on("GetPoints", (points: Array<PointDto>) => {
      points.forEach(p => this.addPointImmediate(p));
    });

    this.connection.start().then(() => { this.connectionUp = true; }).catch(e => {
      console.error("Failed to start SignalR connection.");
    });
  }

  public trackByFn(index, item: Point) {
    return item.id; // or item.id
  }

  private addPointImmediate(p: PointDto) {
    const newPoint: Point = <Point> {
      x: p.x,
      y: p.y,
      id: p.id,
      color: p.color,
      width: p.width,
      opacity: p.opacity
    };

    this.points.push(newPoint);
  }

  private addPoint(p: PointDto) {
    const newPoint: Point = <Point> {
      x: p.x,
      y: p.y,
      id: p.id,
      color: p. color,
      opacity: p.opacity,
      width: 0.0,
    };

    this.points.push(newPoint);
    this.cd.markForCheck();

    window.setTimeout(() => {
      newPoint.width = p.width;
      this.cd.markForCheck();
      console.log('WTF');
    }, 48);
  }

  handleClick(event: MouseEvent): void {
    if (this.isTouch) {
      return;
    }

    const outDto: PointOutputDto = {
      x: event.offsetX,
      y: event.offsetY,
      color: this.getRandomColor(),
      width: this.getRandomWidth(),
      opacity: this.getRandomOpacity()
    };

    this.connection.invoke("AddPoint", outDto)
      .catch(e => console.error(e.toString()));
  }

  handleTouch(event: TouchEvent): void {
    if (!this.isTouch) {
      return;
    }

    const boundingRect = (<HTMLElement>event.srcElement).getBoundingClientRect();

    const outDto: PointOutputDto = {
      x: event.touches[0].clientX - boundingRect.left,
      y: event.touches[0].clientY - boundingRect.top,
      color: this.getRandomColor(),
      width: this.getRandomWidth(),
      opacity: this.getRandomOpacity()
    };

    this.connection.invoke("AddPoint", outDto)
      .catch(e => console.error(e.toString()));
  }

  private getRandomColor(): string {
    const colors = [
      "#cf2115", "#1591cf", "#151ecf",
      "#9415cf", "#1ca643", "#dea11d",
      "#e6aae0"];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getRandomWidth(): number {
    return 30.0 + Math.random() * 150.0;
  }

  private getRandomOpacity(): number {
    return 0.4 + Math.random() * 0.6;
  }
}
