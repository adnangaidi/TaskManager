import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, data);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${API_URL}/change-password`, { oldPassword, newPassword });
  }
}
