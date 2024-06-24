import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface VoteResponse {
  total: number;
  votes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = 'http://localhost:3000/votes/';

  constructor(private http: HttpClient) { }

  getTotalVotes(): Observable<VoteResponse> {
    return this.http.get<VoteResponse>(this.apiUrl);
  }
}
