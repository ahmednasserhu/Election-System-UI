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
  constructor(private _HttpClient: HttpClient, private router: Router) { }
  private baseUrl = 'http://localhost:3000/elections';
  getElections(): Observable<Election[]> {
    return this._HttpClient.get<Election[]>('http://localhost:3000/elections');
  }

  getMyElections(id: any): Observable<Election[]> {
    return this._HttpClient.get<Election[]>(`http://localhost:3000/elections/candidate/${id}`);
  }

  getSpecificElections(): Observable<Result[]> {
    return this._HttpClient
      .get<{ results: Result[] }>('http://localhost:3000/results/election')
      .pipe(map((response) => response.results));
  }
  getSpecificElection(id: any): Observable<any> {
    return this._HttpClient.get<{ results: any }>(
      `http://localhost:3000/elections/${id}`,
    );
  }

  getCandidateElections(page: number = 1, rows: number = 10): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}?page=${page}&limit=${rows}&status=in-progress`);
}


  getStatusElection(status: any, page: any = 1): Observable<any> {
    console.log(page)
    status = status === '' ? '' : `?status=${status}`;
    page = status === '' ? '' : `page=${page}`;
    return this._HttpClient.get<{ results: any }>(
      `http://localhost:3000/elections${status}&${page}`,
    );
  }
}
