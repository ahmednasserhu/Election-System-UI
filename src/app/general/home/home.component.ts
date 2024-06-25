import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TestimonialComponent } from '../testimonial/testimonial.component';
import { ElectionResultComponent } from '../election-result/election-result.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbCarouselModule, TestimonialComponent, ElectionResultComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  image = '../../../assets/images/election_image.jpeg';
}
