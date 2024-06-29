import { ToastrService } from 'ngx-toastr';
import { VoteService } from '../../services/vote.service';
import { ElectionService } from './../../services/election.service';
import { Router } from '@angular/router';
import { FormGroup, FormsModule, NgModel } from '@angular/forms';  // Import FormsModule
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';

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
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { CountdownComponent } from 'ngx-countdown';

Chart.register(...registerables);

interface CandidateJwtPayload extends JwtPayload {
  candidate: {
    _id: string;
  };
}

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    FormsModule,
    FormsModule,
    InputOtpModule,
    ButtonModule,
    CountdownComponent,
  ],
  templateUrl: './election-details.component.html',
  styleUrls: ['./election-details.component.css'],
})
export class ElectionDetailsComponent
  implements OnDestroy, OnChanges, AfterViewInit
{
  value: any;
  private chart: Chart | undefined;
  result!: any;
  currentDate!: Date;
  statusDate!: string;

  @ViewChild('otpModalTemplate') otpModalTemplate!: TemplateRef<any>; // ViewChild to access the template
  private modalService = inject(NgbModal);
  closeResult = '';
  alreadyCandidate = false;
  otpNum: any = '';
  otpArray = ['', '', '', '', '', '']; // Array to store OTP digits
  countFinished = false;
  registerForm !: FormGroup;
  otpForm!: FormGroup;
  constructor(
    private router: Router,
    private _ElectionService: ElectionService,
    private VoteService: VoteService,
    private toaster: ToastrService,
    private cd: ChangeDetectorRef,
  ) {
    this.currentDate = new Date();
    this._ElectionService
      .getSpecificElection(this.router.url.split('/')[3])
      .subscribe((res) => {
        this.result = res;
        console.log(678, res);
        let token = localStorage.getItem('token') || '';
        let decodedToken = jwtDecode<CandidateJwtPayload>(token);
        this.alreadyCandidate = this.result.candidates.some(
          (candidate: any) => decodedToken?.candidate?._id === candidate?._id,
        );
        console.log(this.alreadyCandidate);
        this.statusDate =
          this.currentDate < new Date(this.result.startdate)
            ? 'Pending'
            : this.currentDate > new Date(this.result.enddate) ||
                (this.currentDate > new Date(this.result.startdate) &&
                  this.currentDate < new Date(this.result.enddate) &&
                  this.result.candidates.length === 1)
              ? 'Finished'
              : 'In-progress';
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
    // if (
    //   !this.result ||
    //   !this.result.electionId ||
    //   !this.result.electionId._id
    // ) {
    //   console.warn('Missing or invalid data to render chart.');
    //   return;
    // }

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

  navigateToApplyForm() {
    this.router.navigate(['/user', 'apply', this.result._id]);
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
        this.toaster.error(err.error.message);
      },
    });
  }
  resendOTP(candidateId: any, electionId: any) {
    this.VoteService.vote({
      candidateId: candidateId,
      electionId: electionId,
    }).subscribe({
      next: (res) => {
        // Open the modal after receiving a successful response
        this.toaster.info('A new OTP was sent to your email');
        this.countFinished = false;
      },
      error: (err) => {
        this.toaster.error(err.error.message);
      },
    });
  }
  handleCount(event: any) {
    if (event.action === 'done') {
      this.countFinished = true;
    }
  }
  voteWithOTP(candidateId: any, electionId: any) {
    console.log(this.value);
      if (!this.value || this.value.length !== 6) {
    this.toaster.error('Please enter a valid 6-digit OTP');
    return;
      }
      // Call your service
      this.cd.detectChanges();

    this.VoteService.vote({
      candidateId: candidateId,
      electionId: electionId,
      otp: this.value,
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.toaster.success(res.message);
        this.value = '';
        this.closeModal();
      },
      error: (err) => {
        this.toaster.error(err.error.message);
        this.value = '';
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

  closeModal() {
    this.modalService.dismissAll();
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
    console.log('OTP Entered:', this.value);
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
