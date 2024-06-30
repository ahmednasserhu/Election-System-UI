import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private _HttpClient: HttpClient) {}
  status(): Observable<any> {
    return this._HttpClient.get(
      'http://localhost:3000/citizens/application-status',
      {
        headers: {
          token: `${localStorage.getItem('token')}`,
        },
      },
    );
  }
}
