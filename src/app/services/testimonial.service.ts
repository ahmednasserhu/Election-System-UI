import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  constructor(private _HttpClient: HttpClient) {}
  getTestimonial(): Observable<any> {
    return this._HttpClient.get<any>('http://localhost:3000/testimonials');
  }

  sendTestimonial(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('token', `${token}`);
    return this._HttpClient.post('http://localhost:3000/testimonials', data, {
      headers,
    });
  }
}
