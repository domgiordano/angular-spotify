// user.service.ts
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  accessToken: string;
  refreshToken: string;
  user: any;
  userName = '';
  id = '';
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(
      private http: HttpClient,
      private AuthService: AuthService
    ) {}

  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
    this.refreshToken = this.AuthService.getRefreshToken();
  }

  getUserData(): Observable<any> {
    this.accessToken = this.AuthService.getAccessToken();
    return this.http.get(`${this.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
  }

  setUser(data): void{
      this.userName = data.display_name;
      this.id = data.id;
      this.user = data;
  }
  getUser(): any {
       return this.user;
  }
  getProfilePic(): string {
      return this.user.images[0].url;
  }

  getUserName(): string {
      return this.userName;
  }

  getEmail(): string {
      return this.user.email;
  }

  getFollowers(): number {
      return this.user.followers.total;
  }

  getAccessToken(): string {
    return this.accessToken;
  }
  getRefreshToken(): string {
    return this.refreshToken;
  }
  getUserId(): string {
    return this.id;
  }

}
