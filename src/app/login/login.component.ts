import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule ,Validators,FormBuilder,FormGroup,AbstractControl, ValidationErrors  } from '@angular/forms';
import { Router,RouterLink, RouterLinkActive } from '@angular/router';
// import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,RouterLinkActive,CommonModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errMsg: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, this.ssnValidator]],
      password: ["", [Validators.required, ]]
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
            this.router.navigate(["/admin"]);
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

  login(userData: any) {
    // Replace with your backend API URL
    const apiUrl = 'http://localhost:3000/citizens/signin';

    return this.http.post(apiUrl, userData);
  }
  // Custom validator for SSN
  ssnValidator(control: AbstractControl): ValidationErrors | null {
    // const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/; // Adjust regex as per your SSN format
    const ssnRegex = /^\d{14}$/;
    if (control.value && !ssnRegex.test(control.value)) {
      return { invalidSSN: true };
    }
    return null;
  }
}
