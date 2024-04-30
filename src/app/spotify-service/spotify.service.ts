// spotify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    // Replace 'your_client_id' and 'your_client_secret' with your Spotify API credentials
    const clientId = '1c79964c237042fe88b87da133a231fc';
    const clientSecret = '1e89558785f64b75b41dc83206355048';
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    });

    const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return this.http.post<any>(`${this.apiUrl}/token`, body, { headers });
  }
}
