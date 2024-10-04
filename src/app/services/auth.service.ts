// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly clientId = '1c79964c237042fe88b87da133a231fc';
  private readonly clientSecret = '1e89558785f64b75b41dc83206355048'; // Not secure
  private readonly redirectUri = 'http://localhost:4200/callback';
  private readonly scope = 'user-read-private user-read-email user-library-read user-top-read';

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scope)}&response_type=code`;
    window.location.href = authUrl;
  }

  handleCallback() {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      this.exchangeCodeForToken(code);
    }
  }

  private exchangeCodeForToken(code: string) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams();

    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret); // Sending the Client Secret

    this.http.post(tokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        console.log('Tokens saved.');
        this.router.navigate(['/my-profile']); // Navigate after login
      },
      error: (err) => {
        console.error('Token exchange failed', err);
      },
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Optionally navigate to login or home page
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
