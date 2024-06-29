import { ElectionService } from './../../services/election.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent implements OnDestroy, OnChanges, AfterViewInit {
  private chart: Chart | undefined;
  @Input() result: any;
  constructor(
    private router: Router,
    private _ElectionService: ElectionService,
  ) {}
  ngAfterViewInit(): void {
    if (!this.result || !this.result._id) {
      console.warn('Result data is not available:', this.result);
      return;
    }
    console.log('Data available for rendering:', this.result);
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && !changes['result'].firstChange) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.renderChart();
    }
  }
  ngOnInit(): void {
    console.log(this.result);
  }
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  renderChart(): void {
    if (!this.result || !this.result._id) {
      console.warn('Missing or invalid data to render chart.');
      return;
    }

    const canvasId = `barchart-${this.result._id}`;
    console.log('Canvas ID:', canvasId);

    const canvasElement = document.getElementById(
      canvasId,
    ) as HTMLCanvasElement;
    console.log('Canvas Element:', canvasElement);

    if (!canvasElement) {
      console.warn(`Canvas element with ID ${canvasId} not found.`);
      return;
    }
    let delayed: any;
    const chartConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: this.result.candidates.map(
          (candidate: any) =>
            `${candidate.citizenDetails.firstName} ${candidate.citizenDetails.lastName}`,
        ),
        datasets: [
          {
            label: this.result.title,
            data: this.result.candidates.map((candidate: any) =>
              Number(candidate.percentage),
            ),
            backgroundColor: [
              'rgb(255, 99, 132)', // Red
              'rgb(54, 162, 235)', // Blue
              'rgb(255, 205, 86)', // Yellow
              'rgb(75, 192, 192)', // Teal
              'rgb(153, 102, 255)', // Purple
              'rgb(255, 159, 64)', // Orange
              'rgb(201, 203, 207)', // Light Gray
              'rgb(255, 180, 90)', // Peach
              'rgb(0, 204, 153)', // Sea Green
              'rgb(102, 255, 102)', // Lime Green
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === 'data' &&
              context.mode === 'default' &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
      },
    };

    const ctx = canvasElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, chartConfig);
    } else {
      console.error('Failed to get 2D context from canvas element.');
    }
  }
  navigateToApplyForm() {
    this.router.navigate(['/user', 'apply', this.result._id]);
  }
}
