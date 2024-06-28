import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Election } from '../interface/election';
import { Result } from '../interface/result';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(private _HttpClient: HttpClient, private router:Router) {}
  getElections(): Observable<Election[]> {
    return this._HttpClient.get<Election[]>('http://localhost:3000/elections');
  }

  getSpecificElections(): Observable<Result[]> {
    return this._HttpClient
      .get<{ results: Result[] }>('http://localhost:3000/results/election')
      .pipe(map((response) => response.results));
  }
  getSpecificElection(id: any): Observable<any> {
    return this._HttpClient
      .get<{ results: any }>(`http://localhost:3000/elections/${id}`)
  }

  getStatusElection(status:any): Observable<any> {
    status = status === '' ? '' : `?status=${status}`
    return this._HttpClient.get<{ results: any }>(`http://localhost:3000/elections${status}`)
  }
}
