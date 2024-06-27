import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-candidate-nav-bar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet],
  templateUrl: './candidate-nav-bar.component.html',
  styleUrl: './candidate-nav-bar.component.css',
})
export class CandidateNavBarComponent {
  decodedToken: any;
  userId!: string;
  token!: any;
  constructor(private router: Router){}
  ngOnInit(){
    this.token = localStorage.getItem("token");
    this.decodedToken = jwtDecode(this.token);
    this.userId = this.decodedToken.candidate._id;
    console.log(this.userId);
  }

  logout(){
    localStorage.removeItem("token");
    this.router.navigate(["/"]);
  }

}
