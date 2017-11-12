import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

import { WebSocketService } from '../services/web-socket.service';
import { DataService } from '../services/data-service';

import { ChartDef, DataPoint, ResponseModel, RequestModel } from '../interfaces/chart-def';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styles: ['canvas { border: 1px solid #000; }'],
    providers: [WebSocketService, DataService]
  })

  export class CanvasComponent implements AfterViewInit {
    @ViewChild('canvas') public canvas: ElementRef;

      @Input() public width = 1200;
      @Input() public height = 600;

      private ctx: CanvasRenderingContext2D;

      private margin = { top: 60, left: 60, right: 0, bottom: 60 };
      private renderType = { lines: 'lines', points: 'points' };

      private chartHeight; chartWidth; yMax; xMax; data;
      private maxYValue = 0;
      private ratio = 0;

      private dataObj: ChartDef;
      private dataPoints: DataPoint[] = [];
      private pixelPoints: DataPoint[] = [];

      //default parameter
      private message = {
        FromDate: '2017-03-06 10:10:10',
        ToDate: '2017-03-06 10:11:59',
        Randomize: 100,
        Interval: 1000,
        Message: 'start'
      }

      constructor (private dataService: DataService) {

      }

      public Subscribe() {
        this.dataService.messages.subscribe(msg => {
          var resdata: ResponseModel = JSON.parse(msg);
          if (resdata){
            
            this.dataPoints.push({x:resdata.DateTime, y:resdata.Randomized});
            
            if (this.dataPoints.length == 20) {
              this.dataPoints.splice(1,1);
            }
            
            this.render();
            console.log(this.dataPoints);              
          } 
        });
      }

      public Play() {
        this.message.FromDate = (<HTMLInputElement>document.getElementById("fromdate")).value.toString();
        this.message.ToDate = (<HTMLInputElement>document.getElementById("todate")).value.toString();
        this.message.Randomize = 1000;
        this.message.Interval = 500;
        this.message.Message = 'start';

        this.dataService.messages.next(JSON.stringify(this.message));
        this.Subscribe();
      }

      public Stop() {
        this.message.FromDate = (<HTMLInputElement>document.getElementById("fromdate")).value.toString();
        this.message.ToDate = (<HTMLInputElement>document.getElementById("todate")).value.toString();
        this.message.Randomize = 1000;
        this.message.Interval = 300;
        this.message.Message = 'stop';

        this.dataService.messages.next(JSON.stringify(this.message));
        this.Subscribe();
      }

      public ngAfterViewInit() {

        let adate = new Date();
        (<HTMLInputElement>document.getElementById("fromdate")).value = adate.toString();
        (<HTMLInputElement>document.getElementById("todate")).value =  new Date(adate.setSeconds(adate.getSeconds() + 1000)).toString();

        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        this.ctx = canvasEl.getContext('2d');

        canvasEl.width = this.width;
        canvasEl.height = this.height;

        this.dataObj = {
          title: 'My Chart',
          xLabel: 'xlabel',
          yLabel: 'ylabel',
          labelFont: '19pt Arial',
          dataPointFont: '10pt Arial',
        }

        this.render();
      }

      private getMaxDataYValue() {
        for (let i = 0; i < this.dataPoints.length; i++) {
            if (this.dataPoints[i].y > this.maxYValue) this.maxYValue = this.dataPoints[i].y;
        }
      }

      public render() {
        if (!this.ctx) { return; }
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.getMaxDataYValue();
        this.xMax = this.width - (this.margin.left + this.margin.right);
        this.yMax = this.height - (this.margin.top + this.margin.bottom);
        this.ratio = this.yMax / this.maxYValue;
        this.renderChart();
      }

      public renderChart() {
        this.renderBackground();
        this.renderText();
        this.renderData();
        //renderLinesAndLabels();
      }

      public renderBackground = function() {
        const lingrad = this.ctx.createLinearGradient(this.margin.left, this.margin.top, this.xMax - this.margin.right, this.yMax);
        lingrad.addColorStop(0.0, '#D3D3D3');
        lingrad.addColorStop(0.2, '#fff');
        lingrad.addColorStop(0.8, '#fff');
        lingrad.addColorStop(1, '#D4D4D4');
        this.ctx.fillStyle = lingrad;
        this.ctx.fillRect(this.margin.left, this.margin.top, this.xMax - this.margin.left, this.yMax - this.margin.top);
        this.ctx.fillStyle = 'black';

        //Vertical line
        this.drawLine(this.margin.left, this.margin.top, this.margin.left, this.yMax, 'yellow');

        //Horizontal Line
        this.drawLine(this.margin.left, this.yMax, this.xMax, this.yMax, 'yellow');
      }

      public renderText = function() {
        const labelFont = (this.dataObj.labelFont != null) ? this.dataObj.labelFont : '20pt Arial';
        this.ctx.font = labelFont;
        this.ctx.textAlign = 'center';

        //Title
        let txtSize = this.ctx.measureText(this.dataObj.title);
        this.ctx.fillText(this.dataObj.title, (this.width / 2), (this.margin.top / 1.5));

        //X-axis text
        txtSize = this.ctx.measureText(this.dataObj.xLabel);
        this.ctx.fillText(this.dataObj.xLabel, this.margin.left + (this.xMax / 2) - (txtSize.width / 2), this.yMax + (this.margin.bottom / 1.2));

        //Y-axis text
        this.ctx.save();
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.font = labelFont;
        this.ctx.fillText(this.dataObj.yLabel, (this.yMax / 2) * -1, this.margin.left / 2);
        this.ctx.restore();
    }

    public renderData = function() {
      const xInc = this.getXInc();
      if(xInc == 0){
        console.log('Data too large to be drawn on this canvas');
        return;
      }
      let prevX = 0,
          prevY = 0;

      for (let i = 0; i < this.dataPoints.length; i++) {
        const pt = this.dataPoints[i];
        let ptY = (this.maxYValue - pt.y) * this.ratio;
        if (ptY < this.margin.top) ptY = this.margin.top;
        const ptX = (i * xInc) + this.margin.left;

        if (i > 0) {
          //Draw connecting lines
            this.drawLine(ptX, ptY, prevX, prevY, 'black', 2);
        }
        prevX = ptX;
        prevY = ptY;

        this.pixelPoints.push({x: ptX, y: ptY});

      }
    }

    public drawLine = function(startX, startY, endX, endY, strokeStyle, lineWidth) {
      if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
      if (lineWidth != null) this.ctx.lineWidth = lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }

    private getXInc = function() {
      return Math.round(this.xMax / this.dataPoints.length) ;
    }
  }

