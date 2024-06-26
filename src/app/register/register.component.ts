import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { RegisterCustomValidator } from '../services/RegisterCustomValidation.service';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FormErrorMsgComponent } from '../form-error/form-error.component';
import { CommonModule } from '@angular/common';
import { RegisterServiceService } from '../services/register/register-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    FormErrorMsgComponent,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordVisible = false;
  verifyPasswordVisible = false;
  selectedImage: File | null = null;
  eyeIcon = faEye;
  eyeSlashed = faEyeSlash;
  fileImage = faFileImage;
  loading: boolean = false;
  imageInvalid: boolean = false; 
  constructor(
    private fb: FormBuilder,
    private customValidator: RegisterCustomValidator,
    private registerService: RegisterServiceService,
    private route: Router,
    private toastr: ToastrService,
  ) {
    this.registerForm = this.fb.group(
      {
        SSN: [
          '',
          Validators.compose([
            Validators.required,
            this.customValidator.ssnValidator(),
          ]),
        ],
        motherSSN: [
          '',
          Validators.compose([
            Validators.required,
            this.customValidator.ssnValidator(),
          ]),
        ],
        motherName: [
          '',
          Validators.compose([
            Validators.required,
            this.customValidator.motherNameFullValidator(),
          ]),
        ],
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-Z]+$/),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-Z]+$/),
          ]),
        ],
        image: [null, Validators.required],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^\S+@\S+\.\S+$/),
          ]),
        ],
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^\+20\d{10}$/),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?_!@$%^&*-]).{8,32}$',
            ),
          ]),
        ],
        verifyPassword: ['', Validators.required],
      },
      {
        validator: this.customValidator.MatchPassword(
          'password',
          'verifyPassword',
        ),
      },
    );
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

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const formData = this.registerForm.value;
      formData.image = this.selectedImage;
      this.registerService.register(formData).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res) {
            this.toastr.success('User registered successfully');
            this.route.navigate(['/login']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          const errorMessage = error.error?.message || error.error || 'Registration Failed';
          this.toastr.error(errorMessage, 'Registration Failed');        },
      });
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
      const passwordField = document.getElementById(
        'password',
      ) as HTMLInputElement;
      passwordField.type = this.passwordVisible ? 'text' : 'password';
    } else if (field === 'verifyPassword') {
      this.verifyPasswordVisible = !this.verifyPasswordVisible;
      const verifyPasswordField = document.getElementById(
        'verifyPassword',
      ) as HTMLInputElement;
      verifyPasswordField.type = this.verifyPasswordVisible
        ? 'text'
        : 'password';
    }
  }
}
