import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  register(data:any): Observable<any> {
    const formData = new FormData;
    formData.append('firstName', data.firstName);
    formData.append('lastName',data.lastName);
    formData.append('ssn',data.SSN);
    formData.append('email',data.email);
    formData.append('phoneNumber',data.phoneNumber);
    formData.append('password',data.password);
    formData.append('image',data.image);
    
    return this.http.post(`${this.apiUrl}/citizens/signup/`,formData);
  }
}
