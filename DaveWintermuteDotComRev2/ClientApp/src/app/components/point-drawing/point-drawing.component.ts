import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as signalR  from '@aspnet/signalr';
import { PointOutputDto } from './dto/point-output-dto';
import { PointDto } from './dto/point-dto';
import { Utilities } from 'src/app/utilities/misc';
import { trigger, transition, style, animate, group } from '@angular/animations';

interface Point {
  x: number;
  y: number;
  id: number;
  percentage: number;
  color: string;
  opacity: number;
  localId: number;
}

@Component({
  selector: 'app-point-drawing-component',
  styleUrls: ['./point-drawing.component.scss'],
  templateUrl: './point-drawing.component.html',
  animations: [
    trigger(
      'itemAnim', [
        transition(':enter', [
          style({
            width: 0,
            height: 0,
            transform: `translateX(${PointDrawingComponent.PointBoxSize}px) translateY(${PointDrawingComponent.PointBoxSize}px)`
          }),
          animate('0.5s ease-out',
            style({
              width: PointDrawingComponent.PointBoxSize,
              height: PointDrawingComponent.PointBoxSize,
              transform: `translateX(${PointDrawingComponent.PointBoxSize/2.0}px) translateY(${PointDrawingComponent.PointBoxSize/2.0}px)`
            }))
        ]),
        transition(':leave', [
          style({
            width: PointDrawingComponent.PointBoxSize,
            height: PointDrawingComponent.PointBoxSize,
            transform: `translateX(${PointDrawingComponent.PointBoxSize/2.0}px) translateY(${PointDrawingComponent.PointBoxSize/2.0}px)`
          }),
          animate('0.5s ease-out',
            style({
              width: 0,
              height: 0,
              transform: `translateX(${PointDrawingComponent.PointBoxSize}px) translateY(${PointDrawingComponent.PointBoxSize}px)`
            }))
        ])
    ])
  ]
})
export class PointDrawingComponent implements OnInit  {

  public static readonly PointBoxSize = 150.0;

  private readonly DefaultId = 0;
  private connection: signalR.HubConnection;
  private connectionUp = false;
  private isTouch = false;
  private localCounter = 1;

  public points: Array<Point> = [];
  public get PointBoxSize() { return PointDrawingComponent.PointBoxSize; }

  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    console.log("Starting initialization... " + Date.now());

    this.connection = new signalR.HubConnectionBuilder().withUrl("/pointHub").build();

    this.isTouch = Utilities.isTouchDevice();

    this.connection.on("PointAdded", (pointDto: PointDto) => {
      this.addPointDto(pointDto);
    });

    this.connection.on("PointRemoved", (id: number) => {
      const pointIndex = this.points.findIndex(x => x.id === id);

      if (pointIndex === -1) {
        return;
      }

      this.points.splice(pointIndex, 1);
    });

    this.connection.on("GetPoints", (points: Array<PointDto>) => {
      points.forEach(p => this.addPointDto(p));
    });

    this.connection.start().then(() => { this.connectionUp = true; }).catch(e => {
      console.error("Failed to start SignalR connection.");
    });

    this.connection.onclose(() => {
      this.connectionUp = false;
      console.debug("SignalR disconnected.");
    });
  }

  public trackByFn(index, item: Point) {
    return item.id;
  }


  handleClick(event: MouseEvent): void {
    if (this.isTouch) {
      return;
    }

    this.handleNewPoint(event.offsetX, event.offsetY);
  }

  handleTouch(event: TouchEvent): void {
    if (!this.isTouch) {
      return;
    }

    const boundingRect = (<HTMLElement>event.srcElement).getBoundingClientRect();

    const x = event.touches[0].clientX - boundingRect.left;
    const y = event.touches[0].clientY - boundingRect.top;

    this.handleNewPoint(x, y);
  }

  handleNewPoint(x: number, y: number): void {
    const newPoint: Point = {
      x: x,
      y: y,
      localId: this.localCounter++,
      color: this.getRandomColor(),
      percentage: this.getRandomPercentage(),
      opacity: this.getRandomOpacity(),
      id: this.DefaultId
    };

    const outDto: PointOutputDto = {
      x: x,
      y: y,
      color: newPoint.color,
      percentage: newPoint.percentage,
      opacity: newPoint.opacity
    };

    this.connection.invoke<number>("AddPoint", outDto)
      .then(n => {
        newPoint.id = n;
      })
      .catch(e => console.error(e.toString()));

    this.addLocalPoint(newPoint);
  }

  public percentageToAbosluteMargin(percentage: number): string {
    const value = 50.0 - (percentage * 50.0);

    const stringified = "" + value + "%";

    return stringified;
  }

  private addPointDto(p: PointDto) {
    const newPoint: Point = this.getPointFromDto(p);

    this.points.push(newPoint);
  }

  private addLocalPoint(p: Point) {
    this.points.push(p);
  }

  private getPointFromDto(dto: PointDto): Point {
    const newPoint: Point = <Point> {
      x: dto.x,
      y: dto.y,
      id: dto.id,
      color: dto.color,
      opacity: dto.opacity,
      percentage: dto.percentage,
    };

    return newPoint;
  }

  private getRandomColor(): string {
    const colors = [
      "#cf2115", "#1591cf", "#151ecf",
      "#9415cf", "#1ca643", "#dea11d",
      "#e6aae0"];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getRandomPercentage(): number {
    return 0.25 + Math.random() * 0.75;
  }

  private getRandomOpacity(): number {
    return 0.4 + Math.random() * 0.6;
  }
}
