import { Injectable } from '@angular/core';
import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegisterCustomValidator {
  constructor() {}

  ssnValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ssn = control.value;
      const ssnPattern = /^\d{14}$/;

      if (!ssnPattern.test(ssn)) {
        return { invalidSSN: true };
      }

      const century = parseInt(ssn[0]);
      if (!this.isValidCentury(century)) {
        return { invalidSSN: true };
      }

      const year = parseInt(ssn.substring(1, 3));
      const month = parseInt(ssn.substring(3, 5));
      const day = parseInt(ssn.substring(5, 7));

      if (!this.isValidMonth(month)) {
        return { invalidSSN: true };
      }

      if (!this.isValidDay(day)) {
        return { invalidSSN: true };
      }

      const governorateCode = parseInt(ssn.substring(7, 9));
      if (!this.isValidGovernorateCode(governorateCode)) {
        return { invalidSSN: true };
      }

      const { birthDate, age } = this.extractSSNInfo(ssn);
      if (age < 18) {
        return { invalidSSN: true };
      }

      return null;
    };
  }

  private isValidCentury(century: number): boolean {
    return century === 2 || century === 3;
  }

  private isValidMonth(month: number): boolean {
    return month >= 1 && month <= 12;
  }

  private isValidDay(day: number): boolean {
    return day >= 1 && day <= 31;
  }

  private isValidGovernorateCode(governorateCode: number): boolean {
    const validGovernorateCodes = [
      1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 31, 32, 33, 34, 35, 88,
    ];
    return validGovernorateCodes.includes(governorateCode);
  }

  private extractSSNInfo(ssn: string) {
    const century = parseInt(ssn[0]);
    const year = parseInt(ssn.substring(1, 3));
    const month = parseInt(ssn.substring(3, 5));
    const day = parseInt(ssn.substring(5, 7));

    const birthYear = (century === 2 ? 1900 : 2000) + year;
    const birthDate = new Date(Date.UTC(birthYear, month - 1, day));

    const now = new Date();
    const nowUTC = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );

    let age = nowUTC.getUTCFullYear() - birthDate.getUTCFullYear();
    if (
      nowUTC.getUTCMonth() < birthDate.getUTCMonth() ||
      (nowUTC.getUTCMonth() === birthDate.getUTCMonth() &&
        nowUTC.getUTCDate() < birthDate.getUTCDate())
    ) {
      age--;
    }

    const governorateCode = parseInt(ssn.substring(7, 9));
    const genderIndicator = parseInt(ssn[12]);
    const gender = genderIndicator % 2 === 0 ? 'Female' : 'Male';

    const governorateMap: { [key: number]: string } = {
      1: 'Cairo',
      2: 'Alexandria',
      3: 'Port Said',
      4: 'Suez',
      11: 'Damietta',
      12: 'Dakahlia',
      13: 'Sharkia',
      14: 'Qalyubia',
      15: 'Kafr El Sheikh',
      16: 'Gharbia',
      17: 'Monufia',
      18: 'Beheira',
      19: 'Ismailia',
      21: 'Giza',
      22: 'Beni Suef',
      23: 'Fayoum',
      24: 'Minya',
      25: 'Asyut',
      26: 'Sohag',
      27: 'Qena',
      28: 'Aswan',
      29: 'Luxor',
      31: 'Red Sea',
      32: 'New Valley',
      33: 'Matrouh',
      34: 'North Sinai',
      35: 'South Sinai',
      88: 'Foreign or Unknown',
    };
    const governorate = governorateMap[governorateCode];

    return { birthDate, age, governorate, gender };
  }

  MatchPassword(password: string, verifyPassword: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const passwordControl = control.get(password);
      const verifyPasswordControl = control.get(verifyPassword);

      if (!passwordControl || !verifyPasswordControl) {
        return null;
      }

      if (
        verifyPasswordControl.errors &&
        !verifyPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== verifyPasswordControl.value) {
        verifyPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        verifyPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  motherNameFullValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value;
      const result = this.motherNameValidator(name);

      if (!result.valid) {
        return { invalidMotherName: result.message };
      }

      return null;
    };
  }

  private motherNameValidator(name: string): {
    valid: boolean;
    message: string;
  } {
    if (typeof name !== 'string') {
      return { valid: false, message: 'Name must be a string.' };
    }

    const words = name.trim().split(/\s+/);

    if (words.length !== 4) {
      return {
        valid: false,
        message: 'Full Name must consist of exactly four names.',
      };
    }

    const nameRegex = /^[a-zA-Z]+$/;

    for (let word of words) {
      if (!nameRegex.test(word)) {
        return {
          valid: false,
          message:
            'Each name in the full name must contain only alphabetic characters.',
        };
      }
    }

    return { valid: true, message: 'Valid name.' };
  }
}
