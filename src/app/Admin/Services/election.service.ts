import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private apiUrl = 'http://localhost:3000/elections/';

  constructor(private http: HttpClient) { }

  getLastElection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last-election`);
  }
}
