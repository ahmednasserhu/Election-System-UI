import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplyService {
private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  applyAsCandidate(data:any):Observable<any>{
    const formdata = new FormData();
    console.log("data = ",data);
    
    formdata.append('party',data.party);
    formdata.append('logoName',data.logoName);
    formdata.append('brief',data.brief);
    formdata.append('electionId',data.electionId);
    formdata.append('logoImage',data.logoImage);
    formdata.append('criminalRecord',data.criminalRecord);
    console.log("image = ",data.logoImage);
    console.log("image2 = ",formdata.get("logoImage"));
    
    return this.http.post(`${this.apiUrl}/candidates/apply`,formdata);
  }
}
