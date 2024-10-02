import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { forkJoin, take } from 'rxjs';
import * as localforage from 'localforage';

@Component({
  selector: 'app-playlist-generator-page',
  templateUrl: './playlist-generator.component.html',
  styleUrls: ['./playlist-generator.component.css']
})
export class PlaylistGeneratorComponent implements OnInit {
  private loading: boolean;
  private tracks: any[];
  accessToken: string;
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(
      private http: HttpClient,
      private router: Router,
      private AuthService: AuthService,
      private SongService: SongService
    ) {}
  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
    this.loadTracks();
  }

  loadTracks() {
    this.loading = true;
    const getTracksCalls = forkJoin({
      oneResp: this.SongService.getAllUserTracks(0),
      twoResp: this.SongService.getAllUserTracks(50),
      threeResp: this.SongService.getAllUserTracks(100),
      fourResp: this.SongService.getAllUserTracks(150),
      fiveResp: this.SongService.getAllUserTracks(200),
      sixResp: this.SongService.getAllUserTracks(250)
    })
    getTracksCalls.pipe(take(1)).subscribe({
      next: data => {
        this.tracks = [...data.oneResp, ...data.twoResp, ...data.threeResp,
          ...data.fourResp, ...data.fiveResp, ...data.sixResp]
        // Remove Empty values
        this.tracks = this.tracks.filter(e => e);
        console.log('Tracks--------');
        console.log(this.tracks);
        this.loading = false;
        localStorage.setItem('tracks', JSON.stringify(this.tracks));
      },
      error: err => {
        console.error('Error fetching user tracks', err);
        this.loading = false;
      },
      complete: () => {
        console.log('Tracks Loaded.');
        this.router.navigate(['/my-profile']); // Navigate after login
      }
    });
  }
}
