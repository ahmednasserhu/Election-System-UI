import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(private _HttpClient: HttpClient) {}

  vote(body: any): Observable<any> {
    console.log(body);
    return this._HttpClient.post('http://localhost:3000/votes', body, {
      headers: {
        token: `${localStorage.getItem('token')}`,
      },
    });
  }
}
