import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  private apiUrl = 'http://localhost:3000/citizens/';
  constructor(private http: HttpClient) { }

  getTotalCitizen(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
