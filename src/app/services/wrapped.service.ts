import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WrappedService {
  private baseUrl: string = 'https://your-api-endpoint.com'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  // Method to get user wrapped data based on the selected term (short, medium, long)
  getUserWrappedData(email: string): Observable<any> {
    const url = `${this.baseUrl}/wrapped-data?email=${email}`;
    return this.http.get<any>(url);
  }

  // Optional method to sign up the user for monthly wrapped (if not opted in)
  optInUserForWrapped(email: string, refreshToken: string): Observable<any> {
    const url = `${this.baseUrl}/opt-in`;
    const body = {
      email: email,
      refreshToken: refreshToken,
    };
    return this.http.post<any>(url, body);
  }
}
