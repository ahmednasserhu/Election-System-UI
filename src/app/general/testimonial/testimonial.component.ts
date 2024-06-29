import { TestimonialService } from '../../services/testimonial.service';
import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
// import { Product } from '@domain/product';
// import { ProductService } from '../../services/product.service'; // Ensure the correct path
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [NgbCarouselModule, CarouselModule, ButtonModule, TagModule],
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css'], // Corrected to 'styleUrls'
  // providers: [ProductService],
})
export class TestimonialComponent implements OnInit {
  testimonials!: any;
  // products: Product[] | undefined;
  responsiveOptions: any[] | undefined;

  constructor(
    private testimonialService: TestimonialService,
    // private productService : ProductService,
  ) {}

  ngOnInit(): void {
    this.testimonialService.getTestimonial().subscribe((res) => {
      console.log(res);
      this.testimonials = res.paginationResults.results;
    });

    // this.productService.getProductsSmall().then((products:any) => {
    //   this.products = products;
    // });

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }
}
