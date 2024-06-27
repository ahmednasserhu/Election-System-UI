import { TestimonialService } from './../../services/testimonial.service';
import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [NgbCarouselModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.css',
})
export class TestimonialComponent {
  testimonials!: any;
  constructor(private TestimonialService: TestimonialService) {}
  ngOnInit(): void {
    this.TestimonialService.getTestimonial().subscribe((res) => {
      console.log(res);
      this.testimonials = res.paginationResults.results;
    });
  }
}
