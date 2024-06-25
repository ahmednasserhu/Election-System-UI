import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../Interfaces/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates/';

  constructor(private http: HttpClient) { }

 
  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}`);
  }

  approveCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/review`, { ...candidate, status: 'Approved' });
  }

  rejectCandidate(candidateId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/review/${candidateId}`);
  }

  getLastCandidate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last-candidate`);
  }
}
