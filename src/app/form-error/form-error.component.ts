import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.css'
})
export class FormErrorMsgComponent {
  @Input() formInput!: AbstractControl<any, any>;
  @Input() validationType!: string;
  @Input() errorMsg!: string;
}
