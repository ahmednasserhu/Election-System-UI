import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    RouterLinkActive,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  errMsg: string = '';
  forgotPasswordMsg: string = '';
  forgotPasswordErrorMsg: string = '';
  resetPasswordMsg: string = '';
  resetPasswordErrorMsg: string = '';
  isLoading: boolean = false;
  isForgotPasswordLoading: boolean = false;
  isResetPasswordLoading: boolean = false;
  resetPasswordToken: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      ssn: ['', [Validators.required, this.ssnValidator]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordValidator],
      ],
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.formBuilder.group(
      {
        token: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  handleForm(): void {
    this.isLoading = true;
    const userData = this.loginForm.value;
    if (this.loginForm.valid) {
      this.login(userData).subscribe({
        next: (response: any) => {
          if (response.token && response.role) {
            const decodedToken: any = jwtDecode(response.token); // Decode the JWT token
            if (!decodedToken.citizen.emailConfirmation) {
              this.isLoading = false;
              this.showToast('Please confirm your email before logging in.');
            } else {
              localStorage.setItem('token', response.token);
              this.authService.navigateBasedOnRole(response.role);
            }
          }

        },
        error: (err) => {
          // this.errMsg = err.error.message;
          // this.isLoading = false;
          //////////////////////
          // console.log('jhgjkj')
          this.toastr.error(err.error.message)
        },
      });
    }
  }

  showToast(message: string, duration: number = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-warning');
    alertDiv.role = 'alert';
    alertDiv.textContent = message;

    // Assuming you have a div with id 'toastContainer' in your HTML to append the alert
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer) {
      toastContainer.innerHTML = ''; // Clear previous alerts
      toastContainer.appendChild(alertDiv);
    }

    // Automatically remove the alert after 'duration' milliseconds
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }

  handleForgotPassword(): void {
    this.isForgotPasswordLoading = true;
    this.forgotPasswordMsg = '';
    this.forgotPasswordErrorMsg = '';
    const emailData = this.forgotPasswordForm.value;
    if (this.forgotPasswordForm.valid) {
      this.forgotPassword(emailData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.forgotPasswordMsg = 'Reset link sent to your email address.';
          this.isForgotPasswordLoading = false;
          this.closeForgotPasswordModal();
        },
        error: (err) => {
          console.error(err);
          this.forgotPasswordErrorMsg = err.error.message;
          this.isForgotPasswordLoading = false;
        },
      });
    }
  }

  handleResetPassword(): void {
    this.isResetPasswordLoading = true;
    this.resetPasswordMsg = '';
    this.resetPasswordErrorMsg = '';
    const resetData = this.resetPasswordForm.value;
    if (this.resetPasswordForm.valid) {
      this.resetPassword(resetData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.resetPasswordMsg = 'Password successfully reset.';
          this.isResetPasswordLoading = false;
          this.resetPasswordForm.reset();
          this.closeForgotPasswordModal();
        },
        error: (err) => {
          console.error(err);
          this.resetPasswordErrorMsg = err.error.message;
          this.isResetPasswordLoading = false;
        },
      });
    }
  }

  login(userData: any) {
    const apiUrl = 'http://localhost:3000/citizens/signin';
    return this.http.post(apiUrl, userData);
  }

  forgotPassword(emailData: any) {
    const apiUrl = 'http://localhost:3000/citizens/forgot-password';
    return this.http.post(apiUrl, emailData);
  }

  resetPassword(resetData: any) {
    const apiUrl = 'http://localhost:3000/citizens/reset-password';
    return this.http.post(apiUrl, resetData);
  }

  openForgotPasswordModal(): void {
    this.resetPasswordToken = '';
    const modal = new bootstrap.Modal(
      document.getElementById('forgotPasswordModal')!,
    );
    modal.show();
  }

  closeForgotPasswordModal(): void {
    this.resetPasswordToken = '';
    const modalElement = document.getElementById('forgotPasswordModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal?.hide();
  }

  // Custom validator for SSN
  ssnValidator(control: AbstractControl): ValidationErrors | null {
    const ssnRegex = /^\d{14}$/;
    if (control.value && !ssnRegex.test(control.value)) {
      return { invalidSSN: true };
    }
    return null;
  }

  // Custom validator for password
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (control.value && !passwordRegex.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
