import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Election } from '../Interfaces/election';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private apiUrl = 'http://localhost:3000/elections/';

  constructor(private http: HttpClient) { }

  getLastElection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last-election`);
  }
  getElections(): Observable<Election[]> {
    return this.http.get<Election[]>(this.apiUrl);
  }

  getElection(id: number): Observable<Election> {
    return this.http.get<Election>(`${this.apiUrl}/${id}`);
  }

  createElection(election: Election): Observable<Election> {
    return this.http.post<Election>(this.apiUrl, election);
  }

  updateElection(election: Election): Observable<Election> {
    return this.http.put<Election>(`${this.apiUrl}/${election.id}`, election);
  }

  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
