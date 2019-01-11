import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  REAL_API_URL = 'http://localhost:8080/workflows';

  constructor(private http: HttpClient) {
  }


  getStepTypes(): Observable<any> {
    return this.http.get(this.REAL_API_URL + '/getsteptypes');
  }

  getParamaters(): Observable<any> {
    return this.http.get(this.REAL_API_URL + '/datacontextattributes');
  }


  save(data: any): Observable<any> {
    return this.http.post(this.REAL_API_URL + '/save', data);
  }

  getAll(): Observable<any> {
    return this.http.get(this.REAL_API_URL + '/GetAllWorkflows');
  }

  run(data: any): Observable<any> {
    return this.http.post(this.REAL_API_URL + '/run', data,
    { headers: new HttpHeaders({ 'Content-Type':  'application/json'}),
    responseType: 'text'});
  }
}
