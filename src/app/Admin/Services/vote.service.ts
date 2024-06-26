import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vote } from '../Interfaces/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:3000/votes/';

  constructor(private http: HttpClient) { }

  getTotalVotes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getLastVote(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}last`);
  }

}
