import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SongService implements OnInit {
  private accessToken: string;
  private tracks = [];
  private topTracksShortTerm: any[] = [];
  private topTracksMedTerm: any[] = [];
  private topTracksLongTerm: any[] = [];
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient, private AuthService: AuthService) {}

  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
  }

  getUserTracks(offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/me/tracks`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      params: {
        limit: "50",
        offset: offset.toString(),
      },
    }).pipe(catchError(() => of({ items: [] }))); // Handle errors gracefully
  }

  getAllUserTracks(offset: number): Observable<any[]> {
    let allTracks: any[] = [];
    this.accessToken = this.AuthService.getAccessToken();

    return new Observable((observer) => {
      const fetchTracks = () => {
        this.getUserTracks(offset).subscribe((data) => {
          allTracks = [...allTracks, ...data.items];
          offset += 300;

          // Check if there are more tracks to fetch
          if (data.items.length > 0) {
            fetchTracks(); // Fetch next batch
          } else {
            observer.next(allTracks);
            this.tracks = allTracks;
            observer.complete();
          }
        });
      };

      fetchTracks();
    });
  }

  getTopTracks(term: string): Observable<any> {
    this.accessToken = this.AuthService.getAccessToken();
    return this.http.get(`${this.baseUrl}/me/top/tracks?limit=50&time_range=${term}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
    }).pipe(catchError(() => of({ items: [] }))); // Handle errors gracefully
  }

  setTopTracks(short: any[], med: any[], long: any[]): void {
    this.topTracksShortTerm = short;
    this.topTracksMedTerm = med;
    this.topTracksLongTerm = long;
  }

  getShortTermTopTracks(): any[] {
    return this.topTracksShortTerm;  // Return a copy
  }

  getMedTermTopTracks(): any[] {
    return this.topTracksMedTerm;    // Return a copy
  }

  getLongTermTopTracks(): any[] {
    return this.topTracksLongTerm;   // Return a copy
  }
  getTracks(): any[] {
    return this.tracks;
  }
}
