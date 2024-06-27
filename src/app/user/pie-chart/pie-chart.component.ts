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
export class PieChartComponent  implements OnDestroy, OnChanges, AfterViewInit
{
  private chart: Chart | undefined;
  @Input()  result : any;
  constructor(
    private router: Router,
    private _ElectionService: ElectionService,
  ) {
  }
  ngAfterViewInit(): void {
    console.log(111111111111,this.result)
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
  ngOnInit(): void {}
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
      type: 'pie',
      data: {
        labels: this.result.candidates.map(
          (candidate: any) => candidate.candidateName,
        ),
        datasets: [
          {
            label: this.result.electionId.title,
            data: this.result.candidates.map((candidate: any) =>
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
    this.router.navigate(['/user', 'apply', this.result.electionId._id]);
  }
}
