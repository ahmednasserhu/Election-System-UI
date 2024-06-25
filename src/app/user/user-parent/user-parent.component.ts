import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';
import { FooterComponent } from '../../general/footer/footer.component';

@Component({
  selector: 'app-user-parent',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserNavbarComponent, FooterComponent],
  templateUrl: './user-parent.component.html',
  styleUrl: './user-parent.component.css',
})
export class UserParentComponent {}
