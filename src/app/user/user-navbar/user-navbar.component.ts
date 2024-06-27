import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Citizen } from '../../Admin/Interfaces/citizen';



interface TokenPayload {
  name: string;
  image: string;
  citizen: Citizen;
}


@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent {
  citizenName: string | null = '';
  citizenImage: string | null = '';
  userId!: string;
  /**
   *
   */
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<TokenPayload>(token);
      console.log(decodedToken);
     
      this.citizenName = decodedToken.citizen.firstName;
      this.citizenImage = decodedToken.citizen.image;
      this.userId = decodedToken.citizen._id;
    }
  }

  
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
}
