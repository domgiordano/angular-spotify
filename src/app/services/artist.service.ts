// song.service.ts
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, expand, takeWhile } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArtistService implements OnInit {
  accessToken: string;
  artists = [];
  topArtistsShortTerm = [];
  topArtistsMedTerm = [];
  topArtistsLongTerm = [];
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(
      private http: HttpClient,
      private AuthService: AuthService
    ) {}
  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
  }

  getTopArtists(term: string): Observable<any> {
    this.accessToken = this.AuthService.getAccessToken();
    return this.http.get(`${this.baseUrl}/me/top/artists?limit=50&time_range=${term}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
    }).pipe(catchError(() => of({ items: [] }))); // Handle errors gracefully
  }

  getShortTermTopArtists(): any[] {
    return this.topArtistsShortTerm;
  }
  getMedTermTopArtists(): any[] {
    return this.topArtistsMedTerm;
  }
  getLongTermTopArtists(): any[] {
    return this.topArtistsLongTerm;
  }
  setShortTermTopArtists(Artists: any[]): void {
    this.topArtistsShortTerm = Artists;
  }
  setMedTermTopArtists(Artists: any[]): void {
    this.topArtistsMedTerm = Artists;
  }
  setLongTermTopArtists(Artists: any[]): void {
    this.topArtistsLongTerm = Artists;
  }

  getArtists(): any[] {
    return this.artists;
  }

}
