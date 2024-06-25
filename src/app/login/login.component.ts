import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust the path as necessary
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, RouterLinkActive, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  errMsg: string = '';
  forgotPasswordMsg: string = '';
  isLoading: boolean = false;
  isForgotPasswordLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      ssn: ["", [Validators.required, this.ssnValidator]],
      password: ["", [Validators.required, Validators.minLength(8), this.passwordValidator]]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  handleForm(): void {
    this.isLoading = true;
    const userData = this.loginForm.value;
    if (this.loginForm.valid) {
      this.login(userData).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.token) {
            localStorage.setItem("token", response.token);
            this.isLoading = false;
            this.authService.navigateBasedOnRole(response.token);
          }
        },
        error: (err) => {
          console.error(err);
          this.errMsg = err.error.message;
          this.isLoading = false;
        }
      });
    }
  }

  handleForgotPassword(): void {
    this.isForgotPasswordLoading = true;
    const emailData = this.forgotPasswordForm.value;
    if (this.forgotPasswordForm.valid) {
      this.forgotPassword(emailData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.forgotPasswordMsg = "Reset link sent to your email address.";
          this.isForgotPasswordLoading = false;
          this.closeForgotPasswordModal();
        },
        error: (err) => {
          console.error(err);
          this.forgotPasswordMsg = err.error.message;
          this.isForgotPasswordLoading = false;
        }
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

  openForgotPasswordModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal')!);
    modal.show();
  }

  closeForgotPasswordModal(): void {
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (control.value && !passwordRegex.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }
}
