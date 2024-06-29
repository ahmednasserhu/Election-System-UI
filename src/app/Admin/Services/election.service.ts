import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Election } from '../Interfaces/election';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  private apiUrl = 'http://localhost:3000/elections';

  constructor(private http: HttpClient) {}

  getLastElection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/last-election`);
  }
  getElections(): Observable<Election[]> {
    return this.http.get<{ data: Election[] }>(this.apiUrl).pipe(
      map((response) => {
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error('Invalid response format:', response);
          return [];
        }
      })
    );
  }
  
  

  createElection(election: Election): Observable<Election> {
    return this.http.post<Election>(this.apiUrl, election, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  updateElection(election: Election): Observable<Election> {
    return this.http.patch<Election>(
      `${this.apiUrl}/${election._id}`,
      election,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  deleteElection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getElectionById(id: string): Observable<Election> {
    return this.http.get<Election>(`${this.apiUrl}/${id}`);
  }
}
