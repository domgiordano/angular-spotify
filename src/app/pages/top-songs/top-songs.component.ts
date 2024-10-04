import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-top-songs-page',
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.scss']
})
export class TopSongsComponent implements OnInit {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;
  selectedTerm = 'short_term';
  loading: boolean;
  displayedSongs = [];
  private topTracksShortTerm: any[];
  private topTracksMedTerm: any[];
  private topTracksLongTerm: any[];
  accessToken: string;

  constructor(
      private AuthService: AuthService,
      private SongService: SongService
    ) {
  }

  ngOnInit() {
    this.accessToken = this.AuthService.getAccessToken();
    this.topTracksShortTerm = this.SongService.getShortTermTopTracks();
    this.topTracksMedTerm = this.SongService.getMedTermTopTracks();
    this.topTracksLongTerm = this.SongService.getLongTermTopTracks();
    this.displayedSongs = this.topTracksShortTerm;
    if ( this.topTracksShortTerm.length === 0){
      console.log("Need Top Tracks.");
      this.loadTopTracks();
    }
    else{
      console.log("We got dem top tracks.");
    }
  }

  onTermChange() {
    this.updateDisplayedSongs();
    console.log(this.displayedSongs);
    console.log('Selected term:', this.selectedTerm);
  }

  updateDisplayedSongs() {
    switch (this.selectedTerm) {
      case 'short_term':
        this.displayedSongs = this.topTracksShortTerm;
        break;
      case 'medium_term':
        this.displayedSongs = this.SongService.getMedTermTopTracks(); // Use the stored array
        break;
      case 'long_term':
        this.displayedSongs = this.topTracksLongTerm;
        break;
    }
  }

  playSong(previewUrl: string) {
    if (this.audioPlayer.nativeElement.src !== previewUrl) {
      this.audioPlayer.nativeElement.src = previewUrl;
    }
    this.audioPlayer.nativeElement.play();
  }

  stopSong() {
    this.audioPlayer.nativeElement.pause();
    this.audioPlayer.nativeElement.currentTime = 0; // Reset playback
  }

  loadTopTracks() {
    this.loading = true;
    const getTracksCalls = forkJoin({
      shortTermResp: this.SongService.getTopTracks('short_term'),
      medTermResp: this.SongService.getTopTracks('medium_term'),
      longTermResp: this.SongService.getTopTracks('long_term'),
    });

    getTracksCalls.pipe(take(1)).subscribe({
      next: data => {
        this.SongService.setTopTracks(data.shortTermResp.items, data.medTermResp.items, data.longTermResp.items);
        this.topTracksShortTerm = data.shortTermResp.items; // Set directly for immediate use
        this.topTracksMedTerm = data.medTermResp.items;     // Set directly for immediate use
        this.topTracksLongTerm = data.longTermResp.items;   // Set directly for immediate use
        this.displayedSongs = this.topTracksShortTerm; // Default to short-term
        this.loading = false;
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
  formatArtists(artists: any[]): string {
    return artists.map(artist => artist.name).join(', ');
  }
  viewSongDetails(song: any){
    console.log('Song', song);
  }
}
