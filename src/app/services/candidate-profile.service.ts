import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getProfile(id: any) {
    return this.http.get(`${this.apiUrl}/candidates/${id}`)
  }

  updateProfile(data: any, id:any) {
    return this.http.patch<any>(`${this.apiUrl}/candidates/${id}`,data)
  }
}
