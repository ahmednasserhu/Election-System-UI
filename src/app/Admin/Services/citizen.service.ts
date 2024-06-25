import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  // Ensure the API returns an array of Citizens
  getTotalCitizen(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(this.handleError<any[]>('getTotalCitizen', []))
    );
  }

  getCitizens(): Observable<Citizen[]> {
    return this.http.get<Citizen[]>(this.apiUrl).pipe(
      map(data => Array.isArray(data) ? data : []),
      catchError(this.handleError<Citizen[]>('getCitizens', []))
    );
  }

  blockCitizen(citizenId: string): Observable<any> {
    const url = `${this.apiUrl}${citizenId}/status`;
    return this.http.put(url, { status: 'Blocked' }, this.httpOptions).pipe(
      catchError(this.handleError<any>('blockCitizen'))
    );
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Return an empty result to keep the app running
      return of(result as T);
    };
  }
}
