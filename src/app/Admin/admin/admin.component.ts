import { Component } from '@angular/core';
import { SidebarComponent } from '../Components/sidebar/sidebar.component';
import { NavbarComponent } from '../Components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {}
