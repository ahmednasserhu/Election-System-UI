import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Citizen } from '../Interfaces/citizen';

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  private apiUrl = 'http://localhost:3000/citizens/';
  private statusUrl = 'http://localhost:3000/citizens/status';
  // Adjust as per your API endpoint structure
  private adminUrl = 'http://127.0.0.1:3000/citizens/newAdmin';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}
  getCitizenss(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addAdmin(adminData: FormData): Observable<any> {
    return this.http.post<any>(this.adminUrl, adminData);
  }

  getCitizens(status: any, page: any): Observable<any> {
    status = status !== '' ? `status=${status}&` : '';
    return this.http.get<any>(
      `http://localhost:3000/citizens?${status}page=${page}`,
    );
  }

  updateCitizenStatus(citizenId: string, status: string): Observable<any> {
    const url = `${this.statusUrl}`; // Adjust URL to match your API
    const body = { citizenId, status }; // Include citizenId in the request body
    return this.http
      .put(url, body, this.httpOptions)
      .pipe(catchError(this.handleError<any>('updateCitizenStatus')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
