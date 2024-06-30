import { StatusService } from './../../services/status.service';
import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  status!: any;
  constructor(private StatusService : StatusService) {}
  ngOnInit(): void {
    this.StatusService.status().subscribe((res) => {
      console.log(res);
      this.status = res.applicationStatus;
    },
  (err)=>{
    if(err.error.message === 'Citizen does not have applications'){
      this.status = ''
      console.log(this.status);
    }
    // if(err.message === '')
  });
  }
}
