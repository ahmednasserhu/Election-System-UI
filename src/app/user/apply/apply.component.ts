import { ElectionService } from './../../Admin/Services/election.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterCustomValidator } from '../../services/RegisterCustomValidation.service';
import { FormErrorMsgComponent } from '../../form-error/form-error.component';
import { RegisterServiceService } from '../../services/register/register-service.service';
import { Router } from '@angular/router';
import { ApplyService } from '../../services/apply.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    FormErrorMsgComponent,
    CommonModule,
  ],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.css',
})
export class ApplyComponent {
  registerForm: FormGroup;
  passwordVisible = false;
  verifyPasswordVisible = false;
  selectedImage: File | null = null;
  selectedCriminal: File | null = null;
  eyeIcon = faEye;
  eyeSlashed = faEyeSlash;
  fileImage = faFileImage;
  electionDetails!: any;
  constructor(
    private fb: FormBuilder,
    private customValidator: RegisterCustomValidator,
    private registerService: RegisterServiceService,
    private router: Router,
    private _ElectionService: ElectionService,
    private applyservice: ApplyService,
  ) {
    this.registerForm = this.fb.group({
      logoName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/),
        ]),
      ],
      party: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.maxLength(100),
        ]),
      ],
      brief: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.maxLength(200),
        ]),
      ],
      logoImage: [null, Validators.required],
      criminalRecord: [null, Validators.required],
    });
  }

  ngOnInit() {
    this._ElectionService
      .getElectionById(this.router.url.split('/')[3])
      .subscribe((res) => {
        console.log(res);
        this.electionDetails = res;
      });
  }

  onImagePicked(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        this.selectedImage = file;
      } else {
        Swal.fire({
          title: 'Please select a valid image file',
          icon: 'error',
        });
        this.selectedImage = null;
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  onCriminalPicked(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.type === 'application/pdf') {
        this.selectedCriminal = file;
      } else {
        Swal.fire({
          title: 'Please select a PDF file',
          icon: 'error',
        });
        this.selectedCriminal = null;
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.logoImage = this.selectedImage;
      formData.electionId = this.electionDetails._id;
      formData.criminalRecord = this.selectedCriminal;

      this.applyservice.applyAsCandidate(formData).subscribe(
        (res: any) => {
          if (res) {
            Swal.fire({
              title: 'Application sent successfully',
              icon: 'success',
            });
            this.clearForm();
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            title: `${error.error.message}`,
            icon: 'error',
          });
          this.clearForm();
        },
      );
    }
  }

  clearForm(): void {
    this.registerForm.reset();
    this.selectedImage = null;
    this.selectedCriminal = null;
  }
}
