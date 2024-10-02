
import { Component, OnInit } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-top-songs-page',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css']
})
export class TopSongsComponent implements OnInit {
  private loading: boolean;
  private topTracksShortTerm: any[];
  private topTracksMedTerm: any[];
  private topTracksLongTerm: any[];
  accessToken: string;

  constructor(
      private AuthService: AuthService,
      private SongService: SongService
    ) {}
  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
    this.topTracksShortTerm = this.SongService.getShortTermTopTracks();
    this.topTracksMedTerm = this.SongService.getMedTermTopTracks();
    this.topTracksLongTerm = this.SongService.getLongTermTopTracks();
    if ( this.topTracksShortTerm.length === 0){
      console.log("Need Top Tracks.");
      this.loadTopTracks();
    }
    else{
      console.log("We got dem top tracks.");
    }

  }
  loadTopTracks() {
    this.loading = true;
    const getTracksCalls = forkJoin({
      shortTermResp: this.SongService.getTopTracks('short_term'),
      medTermResp: this.SongService.getTopTracks('medium_term'),
      longTermResp: this.SongService.getTopTracks('long_term'),
    })
    getTracksCalls.pipe(take(1)).subscribe({
      next: data => {
        this.updateTopTracks(data.shortTermResp, data.medTermResp, data.longTermResp);
        this.loading = false;
        console.log("TOP TRACKS FOUND ------");
        console.log(data);
      },
      error: err => {
        console.error('Error fetching user tracks', err);
        this.loading = false;
      },
      complete: () => {
        console.log('Top Tracks Loaded.');
      }
    });
  }

  updateTopTracks(short: any[], med: any[], long: any[]): void {
    this.topTracksShortTerm = short;
    this.topTracksMedTerm = med;
    this.topTracksLongTerm = long;
    this.SongService.setShortTermTopTracks(this.topTracksShortTerm);
    this.SongService.setMedTermTopTracks(this.topTracksMedTerm);
    this.SongService.setLongTermTopTracks(this.topTracksLongTerm);
  }
}
