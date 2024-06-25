import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Citizen } from '../Interfaces/citizen';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  private apiUrl = 'http://localhost:3000/citizens/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getTotalCitizen(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getCitizens(): Observable<Citizen[]> {
    return this.http.get<Citizen[]>(this.apiUrl);
  }

  blockCitizen(citizenId: number): Observable<any> {
    const url = `${this.apiUrl}${citizenId}/status`;
    return this.http.put(url, { status: 'Blocked' }, this.httpOptions);
  }
}
