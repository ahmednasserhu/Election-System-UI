import { Router, RouterLink } from '@angular/router';
import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Result } from '../../interface/result';
Chart.register(...registerables);

@Component({
  selector: 'app-election-card',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './election-card.component.html',
  styleUrls: ['./election-card.component.css'],
})
export class ElectionCardComponent
  implements OnDestroy, OnChanges, AfterViewInit
{
  @Input() result!: Result;
  private chart: Chart | undefined;

  constructor(private router: Router) {}

  goToDetails(): void {
    this.router.navigate([
      '/user',
      'election-details',
      this.result.electionId._id,
    ]);
  }

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  renderChart(): void {
    if (
      !this.result ||
      !this.result.electionId ||
      !this.result.electionId._id
    ) {
      console.warn('Missing or invalid data to render chart.');
      return;
    }

    const canvasId = `barchart-${this.result.electionId._id}`;
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
      type: 'bar',
      data: {
        labels: this.result.candidates.map(
          (candidate) => candidate.candidateName,
        ),
        datasets: [
          {
            label: this.result.electionId.title,
            data: this.result.candidates.map((candidate) =>
              Number(candidate.percentage),
            ),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
        scales: {
          y: {
            beginAtZero: true,
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
}
