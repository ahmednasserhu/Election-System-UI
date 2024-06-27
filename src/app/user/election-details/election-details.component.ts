import { VoteService } from '../../services/vote.service';
import { ElectionService } from './../../services/election.service';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';  // Import FormsModule
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, NgbDatepickerModule, FormsModule],
  templateUrl: './election-details.component.html',
  styleUrls: ['./election-details.component.css'],
})
export class ElectionDetailsComponent
  implements OnDestroy, OnChanges, AfterViewInit
{
  private chart: Chart | undefined;
  result!: any;
  @ViewChild('otpModalTemplate') otpModalTemplate!: TemplateRef<any>; // ViewChild to access the template
  private modalService = inject(NgbModal);
  closeResult = '';
  otpNum: any = '';
  otpArray = ['', '', '', '', '', '']; // Array to store OTP digits

  constructor(
    private router: Router,
    private _ElectionService: ElectionService,
    private VoteService: VoteService,
  ) {
    this._ElectionService
      .getSpecificElection(this.router.url.split('/')[3])
      .subscribe((res) => {
        this.result = res[0];
        console.log(res);
      });
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
      type: 'bar',
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

  navigateToApplyForm() {
    this.router.navigate(['/user', 'apply', this.result.electionId._id]);
  }

  vote(candidateId: any, electionId: any) {
    this.VoteService.vote({
      candidateId: candidateId,
      electionId: electionId,
    }).subscribe({
      next: (res) => {
        // Open the modal after receiving a successful response
        this.openModal();
      },
      error: (err) => {
        console.error('Error during voting:', err);
        // Handle the error as needed
      },
    });
  }

  voteWithOTP(candidateId: any, electionId: any, otp: any) {
    this.VoteService.vote({
      candidateId: candidateId,
      electionId: electionId,
      otp,
    }).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        console.error('Error during voting:', err);
      },
    });
  }

  openModal() {
    const modalRef = this.modalService.open(this.otpModalTemplate, {
      ariaLabelledBy: 'modal-basic-title',
    });
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  moveFocus(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length === 1 && index < this.otpArray.length - 1) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && index > 0) {
      const prevInput = (event.target as HTMLInputElement)
        .previousElementSibling as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onSubmitOtp() {
    // const otp = this.otpArray.join('');
    console.log('OTP Entered:', this.otpNum);
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
