import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Election } from '../interface/election';
import { Result } from '../interface/result';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(private _HttpClient: HttpClient) {}
  getElections(): Observable<Election[]> {
    return this._HttpClient.get<Election[]>('http://localhost:3000/elections');
  }

  getSpecificElections(): Observable<Result[]> {
    return this._HttpClient
      .get<{ results: Result[] }>('http://localhost:3000/results/elections')
      .pipe(map((response) => response.results));
  }
  getSpecificElection(id: any): Observable<any> {
    return this._HttpClient
      .get<{ results: any }>(`http://localhost:3000/results/election/${id}`)
      .pipe(map((response) => response.results));
  }
}
