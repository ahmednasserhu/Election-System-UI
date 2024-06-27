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

  constructor(
    private fb: FormBuilder,
    private customValidator: RegisterCustomValidator,
    private registerService: RegisterServiceService,
    private route: Router
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
      this.selectedImage = file;
      console.log(this.selectedImage);
      
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.image = this.selectedImage;
      // console.log(formData);
      this.registerService.register(formData).subscribe((res: any) => {
        if (res) {
          // console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'User registered successfully',
            timer: 2000
          })
          this.route.navigate(['/login']);
        }
      }),
        (error: HttpErrorResponse) => {
          console.log(error);
        };
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
