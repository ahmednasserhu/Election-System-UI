import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CandidateNavBarComponent } from '../candidate-nav-bar/candidate-nav-bar.component';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { Validators } from '@angular/forms';
import { FormErrorMsgComponent } from '../../form-error/form-error.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    CandidateNavBarComponent,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormErrorMsgComponent,
  ],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css',
})
export class CandidateProfileComponent {
  candidateId!: string;
  profileForm!: FormGroup;
  pen = faPen;
  apiUrl: String = environment.apiUrl;
  image = '';
  selectedImage: File | null = null;

  constructor(
    private profileService: CandidateProfileService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
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
      party: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      brief: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(255)],
      ],
      logoName: [{ value: '', disabled: true }, [Validators.required]],
      logoImage: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['id'];
    });
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile(this.candidateId).subscribe(
      (res: any) => {
        if (res && res.candidate) {
          const candidateData = res.candidate;
          // console.log(candidateData);
          this.profileForm.patchValue({
            ssn: candidateData.citizenId.ssn,
            firstName: candidateData.citizenId.firstName,
            lastName: candidateData.citizenId.lastName,
            email: candidateData.citizenId.email,
            birthDate: this.formatDate(candidateData.citizenId.birthDate),
            phoneNumber: candidateData.citizenId.phoneNumber,
            party: candidateData.party,
            brief: candidateData.brief,
            logoName: candidateData.logoName,
            logoImage: candidateData.logoImage,
            image: candidateData.citizenId.image,
          });
          this.image = candidateData.citizenId.image;
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
  onProfileImageChange(event: Event) {
    // const file = (event.target as HTMLInputElement).files[0];
    // Handle profile image upload logic here
  }

  onLogoImageChange(event: Event) {
    // const file = (event.target as HTMLInputElement).files[0];
    // Handle logo image upload logic here
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
        .updateProfile(formData, this.candidateId)
        .subscribe((res: any) => {
          if (res) {
            console.log(res);
            this.loadProfile();
          }
        }),
        (error: HttpErrorResponse) => {
          console.log(error);
        };
    }
  }
}
