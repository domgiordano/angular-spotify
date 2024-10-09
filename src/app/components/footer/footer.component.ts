import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from 'src/app/services/playlist.service';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showDynamicButton: boolean = false;
  footerButtonText: string = '';
  githubRepoUrl: string = 'https://github.com/domgiordano/angular-spotify'
  userId: string;

  constructor(
    private router: Router,
    private SongService: SongService,
    private PlaylistService: PlaylistService,
    private UserService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.UserService.getUserId();
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // Example logic to show/hide button based on the route
      if (url.includes('/artist')) {
        this.showDynamicButton = true;
        this.footerButtonText = 'Go Back';
      } else if (url.includes('/top-songs')) {
        this.showDynamicButton = true;
        this.footerButtonText = 'Download Playlist';
      } else {
        this.showDynamicButton = false;
      }
    });
  }

  handleDynamicButtonClick() {
    const url = this.router.url;

    if (url.includes('/artist')) {
      this.router.navigate(['/top-artists']);
    } else if (url.includes('/top-songs')) {

      // Get Top Tracks by term
      const currentTerm = this.SongService.getCurrentTerm();
      const today = new Date();
      // Format it as YYYY-MM-DD
      const formattedDate = today.toISOString().split('T')[0];
      let currentTopSongs = [];
      let playlistName = '';
      let playlistDesc = 'Top songs created by https://xomify.com';
      if(currentTerm == 'short_term'){
        currentTopSongs = this.SongService.getShortTermTopTracks();
        playlistName = `Last Month Top Songs: ${formattedDate}`;
      }
      else if(currentTerm == 'medium_term'){
        currentTopSongs = this.SongService.getMedTermTopTracks();
        playlistName = `Last 6 Months Top Songs: ${formattedDate}`;
      }
      else{
        currentTopSongs = this.SongService.getLongTermTopTracks();
        playlistName = `Last Year Top Songs: ${formattedDate}`;
      }

      //let currentTopSongsUriList = currentTopSongs.map(track => track.uri).join(', ');
      let currentTopSongsUriList: string[] = currentTopSongs.map(track => track.uri);
      this.userId = this.UserService.getUserId();
      this.PlaylistService.createPlaylist(this.userId, playlistName, playlistDesc).pipe(take(1)).subscribe({
        next: playlist => {
          this.PlaylistService.addPlaylistSongs(playlist, currentTopSongsUriList).pipe(take(1)).subscribe({
            next: data => {
              console.log(data);
            },
            error: err => {
              console.error('Error Adding Items to Playlist', err);
            },
            complete: () => {
                console.log("Adding Items to Playlist Complete.")
            },
          })
        },
        error: err => {
          console.error('Error Creating Playlist', err);
        },
        complete: () => {
          console.log('Playlist Created.');
        }
      });
    }
  }
  openGitHubRepo() {
    // Open the GitHub repository URL in a new tab
    window.open(this.githubRepoUrl, '_blank');
  }
}
