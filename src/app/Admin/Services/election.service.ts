import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Election,PaginatedResponse } from '../Interfaces/election';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  private apiUrl = 'http://localhost:3000/elections';

  constructor(private http: HttpClient) {}

  getLastElection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/last-election`);
  }


  getElections(page: number, limit: number): Observable<PaginatedResponse<Election>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    return this.http.get<PaginatedResponse<Election>>(this.apiUrl, { params });
  }
  // getElections(): Observable<PaginatedResponse<Election>> {
  //   return this.http.get<PaginatedResponse<Election>>(this.apiUrl);
  // }
  // getElections(page: number, limit: number): Observable<{ results: Election[], totalPages: number }> {
  //   return this.http.get<{ results: Election[], totalPages: number }>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  // }

  
  

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
