import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates/';

  constructor(private http: HttpClient) { }

  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLastCandidate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last-candidate`);
  }
}
