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
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

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
  imageInvalid: boolean = false;
  criminalRecordInvalid: boolean = false;
  constructor(
    private fb: FormBuilder,
    private customValidator: RegisterCustomValidator,
    private registerService: RegisterServiceService,
    private router: Router,
    private _ElectionService: ElectionService,
    private applyservice: ApplyService,
    private toaster: ToastrService,

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
        this.imageInvalid = false;
      } else {
        this.imageInvalid = true;
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
        this.criminalRecordInvalid = false;
      } else {
        this.criminalRecordInvalid = true;
        this.selectedCriminal = null;
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  onSubmit() {
    // Decode JWT token to get user information
    let token = localStorage.getItem('token') || '';
    let decodedToken: any = jwtDecode(token);
console.log(decodedToken);

    // Check user status
    if (decodedToken && decodedToken.status === 'blocked') {
      Swal.fire({
        title: 'Your account is blocked.',
        icon: 'error'
      });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigate(['/login']);
    } else {
      // Proceed with application submission
      this.submitApplication();
    }
  }

  submitApplication() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.logoImage = this.selectedImage;
      formData.electionId = this.electionDetails._id;
      formData.criminalRecord = this.selectedCriminal;

      this.applyservice.applyAsCandidate(formData).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Application sent successfully',
            icon: 'success'
          });
          this.clearForm();
        },
        (err: any) => {
          const errorMessage = err.error.message || 'Failed to submit application.';
          Swal.fire({
            title: errorMessage,
            icon: 'error'
          });
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.router.navigate(['/login']);
          this.clearForm();
        }
      );
    }
  }

  
  
  clearForm(): void {
    this.registerForm.reset();
    this.selectedImage = null;
    this.selectedCriminal = null;
  }
}
