import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormErrorMsgComponent } from '../../../form-error/form-error.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { RegisterCustomValidator } from '../../../services/RegisterCustomValidation.service';
import { CitizenService } from '../../Services/citizen.service';
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
  styleUrls: ['./add-admin.component.css'],
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
    private citizenService: CitizenService,
  ) {
    this.registerForm = this.fb.group(
      {
        SSN: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^\d{14}$/),
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
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$',
            ),
          ]),
        ],
        verifyPassword: ['', Validators.required],
        role: ['admin'],
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

      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('ssn', formData.SSN);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      this.citizenService.addAdmin(formDataToSend).subscribe(
        (res: any) => {
          console.log('Admin added successfully:', res);
        },
        (error: HttpErrorResponse) => {
          console.log('Error adding admin:', error);
        },
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
