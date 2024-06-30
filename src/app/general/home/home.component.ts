import { Router } from '@angular/router';
import { ElectionService } from './../../services/election.service';
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
  ElectionDetails!: any;
  dataCame = false;
  image = '../../../assets/images/election_image.jpeg';
  constructor(
    private ElectionService: ElectionService,
    private Router: Router,
  ) {}
  ngOnInit(): void {
    this.ElectionService.getStatusElection('finished').subscribe((res) => {
      this.ElectionDetails = res.results;
      console.log(res);
      this.dataCame = true;
    });
  }

  goToElectionDetails(id: any) {
    this.Router.navigate(['home-details', id]);
  }
}
