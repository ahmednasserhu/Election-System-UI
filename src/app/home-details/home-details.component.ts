import { ElectionService } from './../services/election.service';
import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-home-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.css'],
})
export class HomeDetailsComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  election?: any;
  private chart: Chart | undefined;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const electionId = params['id'];
      this.electionService.getSpecificElection(electionId).subscribe(
        (election) => {
          this.election = election;
          console.log('Election data:', this.election); // Log the data
        },
        (error) => {
          console.error('Error fetching election:', error); // Log any errors
        },
      );
    });
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.renderChart();
  }

  ngAfterViewInit(): void {
    if (this.election) {
      this.renderChart();
    }
  }
  ngOnChanges(): void {
    if (this.election && !this.chart) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  renderChart(): void {
    if (!this.election) {
      return;
    }

    const canvasId = `barchart-${this.election._id}`;
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
        labels: this.election.candidates.map(
          (candidate: any) =>
            `${candidate.citizenDetails.firstName} ${candidate.citizenDetails.lastName}`,
        ),
        datasets: [
          {
            label: this.election.title,
            data: this.election.candidates.map((candidate: any) =>
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
            borderColor: ['transparent'],
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
}
