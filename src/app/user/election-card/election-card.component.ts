import { Router, RouterLink } from '@angular/router';
import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Result } from '../../interface/result';
import { jwtDecode, JwtPayload } from 'jwt-decode';

Chart.register(...registerables);

interface CandidateJwtPayload extends JwtPayload {
  candidate: {
    _id: string;
  };
}

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
  currentDate!: Date;
  statusDate!: string;
  @Input() result!: any;
  alreadyCandidate!: boolean;
  private chart: Chart | undefined;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentDate = new Date();
    console.log(this.currentDate);
  }

  ngOnInit(): void {
    this.updateCandidateStatusAndDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && !changes['result'].firstChange) {
      this.updateCandidateStatusAndDate();
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
      }
      this.renderChart();
    }
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  updateCandidateStatusAndDate(): void {
    let token = localStorage.getItem('token') || '';
    let decodedToken = jwtDecode<CandidateJwtPayload>(token);
    this.alreadyCandidate = this.result.candidates.some(
      (candidate: any) => decodedToken?.candidate?._id === candidate?._id,
    );
    this.statusDate =
      this.currentDate < new Date(this.result.startdate)
        ? 'Pending'
        : this.currentDate > new Date(this.result.enddate)
          ? 'Finished'
          : 'In-progress';

    this.cdr.detectChanges(); // Ensure the view is updated before rendering the chart
  }

  goToDetails(): void {
    this.router.navigate(['/user', 'election-details', this.result._id]);
  }

  navigateToApplyForm() {
    this.router.navigate(['/user', 'apply', this.result._id]);
  }

  renderChart(): void {
    if (!this.result) {
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
      type: 'bar',
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
