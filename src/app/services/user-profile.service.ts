import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProfile(id: any) {
    return this.http.get(`${this.apiUrl}/citizens/${id}`);
  }

  updateProfile(data: any, id: any) {
    // const formData = new FormData();

    // for (const key in data) {
    //   if (data[key] !== null && data[key] !== undefined) {
    //     formData.append(key, data[key]);
    //   }
    // }

    console.log('user update service', data);

    return this.http.patch<any>(`${this.apiUrl}/citizens/${id}`, data);
  }
}
