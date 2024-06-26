import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormErrorMsgComponent } from '../../../form-error/form-error.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormBuilder,FormGroup,Validators, } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { RegisterCustomValidator } from '../../../services/RegisterCustomValidation.service';
import { RegisterServiceService } from '../../../services/register/register-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    FormErrorMsgComponent,
    CommonModule,
  ],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
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
        role: ['admin'] // Hidden role field
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
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.image = this.selectedImage;
      formData.role = 'admin'; // Explicitly set role
  
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('ssn', formData.SSN);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('image', formData.image);
  
      this.registerService.register(formDataToSend).subscribe(
        (res: any) => {
          if (res) {
            console.log(res);
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
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
