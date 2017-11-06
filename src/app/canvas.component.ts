import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

import { ChartDef, DataPoint } from './interfaces/chart-def';

@Component({
    selector: 'app-canvas',
    template: '<canvas #canvas></canvas>',
    styles: ['canvas { border: 1px solid #000; }']
  })

  export class CanvasComponent implements AfterViewInit {
    @ViewChild('canvas') public canvas: ElementRef;

      @Input() public width = 800;
      @Input() public height = 600;

      private ctx: CanvasRenderingContext2D;

      private margin = { top: 60, left: 60, right: 0, bottom: 60 };
      private renderType = { lines: 'lines', points: 'points' };

      private chartHeight; chartWidth; yMax; xMax; data;
      private maxYValue = 0;
      private ratio = 0;

      private dataObj: ChartDef;
      private dataPoints: DataPoint[];
      private pixelPoints: DataPoint[] = [];

      public ngAfterViewInit() {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        this.ctx = canvasEl.getContext('2d');

        canvasEl.width = this.width;
        canvasEl.height = this.height;

        //default data
        this.dataPoints = [
          {x: 1, y: 10 },
          {x: 2, y: 15 },
          {x: 3, y: 5 },
          {x: 4, y: 8 },
          {x: 4, y: 80 },
          {x: 4, y: 17 },
          {x: 4, y: 1 },
          {x: 4, y: 28 },
          {x: 4, y: 38 },
          {x: 5, y: 49 }
        ];

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
      let prevX = 50,
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
      return Math.round(this.xMax / this.dataPoints.length) - 1;
    }
  }

