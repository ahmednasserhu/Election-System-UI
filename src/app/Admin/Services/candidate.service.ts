import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../Interfaces/candidate';
import {AuthInterceptor} from './interceptors/jwt.service'

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates/';

  constructor(private http: HttpClient) { }

 
  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  approveCandidate(candidate: Candidate): Observable<any> {
    return this.http.post(`${this.apiUrl}${candidate._id}/review`, candidate);
  }

  // rejectCandidate(candidateId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}${candidateId}`);
  // }

  getLastCandidate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last-candidate`);
  }
}
