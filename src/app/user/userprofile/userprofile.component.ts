import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { Validators } from '@angular/forms';
import { FormErrorMsgComponent } from '../../form-error/form-error.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormErrorMsgComponent,
  ],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css',
})
export class UserprofileComponent {
  citizenId!: string;
  dataCame = false;
  profileForm!: FormGroup;
  pen = faPen;
  apiUrl: String = environment.apiUrl;
  image = '';
  selectedImage: File | null = null;

  constructor(
    private profileService: UserProfileService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.profileForm = this.fb.group({
      ssn: [{ value: '', disabled: true }],
      firstName: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      lastName: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)],
      ],
      birthDate: [{ value: '', disabled: true }, [Validators.required]],
      phoneNumber: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\+20\d{10}$/)],
      ],
      governorate: [{ value: '', disabled: true }, [Validators.required]],
      gender: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.citizenId = params['id'];
      this.dataCame = true;
    });
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile(this.citizenId).subscribe(
      (res: any) => {
        if (res && res.citizen) {
          const citizenData = res.citizen;
          // console.log(candidateData);
          this.profileForm.patchValue({
            ssn: citizenData.ssn,
            firstName: citizenData.firstName,
            lastName: citizenData.lastName,
            email: citizenData.email,
            birthDate: this.formatDate(citizenData.birthDate),
            phoneNumber: citizenData.phoneNumber,
            governorate: citizenData.governorate,
            gender: citizenData.gender,
            image: citizenData.image,
          });
          this.image = citizenData.image;
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      },
    );
  }

  enableField(fieldName: string): void {
    this.profileForm.get(fieldName)?.enable();
  }

  onImagePicked(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedImage = file;
    }
  }

  formatDate(dateString: string): string {
    return dateString.split('T')[0];
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      // formData.image = this.selectedImage;
      console.log(formData);
      this.profileService
        .updateProfile(formData, this.citizenId)
        .subscribe((res: any) => {
          if (res) {
            console.log(res);
            Swal.fire({
              title: 'citizen updated successfully',
              icon: 'success',
              timer: 2000,
            });
            this.loadProfile();
          }
        }),
        (error: HttpErrorResponse) => {
          console.log(error);
        };
    }
  }
}
