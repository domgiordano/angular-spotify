import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService implements OnInit {
  private accessToken: string;
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient, private AuthService: AuthService) {}

  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
  }

  createPlaylist(userId: string, playlistName: string, playlistDesc: string): Observable<any> {
    this.accessToken = this.AuthService.getAccessToken();

    const url = `${this.baseUrl}/users/${userId}/playlists`;
    const body =  {
          name: playlistName,
          description: playlistDesc,
          public: true
    };
    const headers = new HttpHeaders({
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
    });
    return this.http.post(url, body, { headers });
  }

  addPlaylistSongs(playlist: any, uriList: string[]): Observable<any> {
    this.accessToken = this.AuthService.getAccessToken();
    const url = `${this.baseUrl}/playlists/${playlist.id}/tracks`;

    const body = {
      uris: uriList
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers });
  }



}
