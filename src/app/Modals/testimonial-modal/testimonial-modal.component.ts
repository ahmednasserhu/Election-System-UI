import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-testimonial-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './testimonial-modal.component.html',
  styleUrl: './testimonial-modal.component.css'
})
export class TestimonialModalComponent {
  @Input() testimonialForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.testimonialForm = this.fb.group({
      message: ['', Validators.required, Validators.maxLength(255), Validators.min(3)]
    });
  }

  open(content: any) {
    this.modalService.open(content);
  }
}
