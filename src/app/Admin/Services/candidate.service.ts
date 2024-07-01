import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../Interfaces/candidate';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates/';

  constructor(private http: HttpClient) {}

  getCandidates(status: any,page:any): Observable<any> {
    status = status != undefined ? `status=${status}&` : '';

    console.log(status);
    return this.http.get<any>(
      `http://localhost:3000/candidates?${status}page=${page}`,
    );
  }


  approveCandidate(candidateId: string): Observable<any> {
    const url = `${this.apiUrl}review`;
    return this.http.post(url, { candidateId, status: 'approved' });
  }

  rejectCandidate(candidateId: string, comment: string): Observable<any> {
    const url = `${this.apiUrl}review`;
    return this.http.post(url, { candidateId, status: 'rejected', comment });
  }

  getLastCandidate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last-candidate`);
  }
}
