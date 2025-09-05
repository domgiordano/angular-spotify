import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';
import { PlayerService } from 'src/app/services/player.service';
import { forkJoin, take } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit {
  loading: boolean;
  artistId: string;
  artist: any = {};
  currentRelatedArtistIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ArtistService: ArtistService,
    private ToastService: ToastService,
    private PlayerService: PlayerService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.artistId = params['id'];
      this.loadArtistDetails(this.artistId);
      this.artist.id = this.artistId;
      this.artist.relatedArtists = [];
    });
  }

  loadArtistDetails(artistId: string) {
    this.loading = true;
    if (artistId) {
      const artistCalls = forkJoin({
        detailsResp: this.ArtistService.getArtistDetails(artistId),
        albumsResp: this.ArtistService.getArtistAlbums(artistId),
        tracksResp: this.ArtistService.getArtistTopTracks(artistId)
      });

      artistCalls.pipe(take(1)).subscribe({
        next: data => this.buildArtist(data.detailsResp, data.albumsResp, data.tracksResp),
        error: err => {
          console.error('Error fetching artist', err);
          this.ToastService.showNegativeToast('Error adding songs to playlist');
          this.loading = false;
        },
        complete: () => { this.loading = false; console.log('Artist Loaded.'); }
      });
    }
  }

  playSong(trackId: string, autoPlay = false) {
    this.PlayerService.playerReady$.pipe(take(1)).subscribe(ready => {
      if (ready) this.PlayerService.playSong(trackId, autoPlay);
      else console.warn('Player not ready yet.');
    });
  }

  stopSong() {
    this.PlayerService.playerReady$.pipe(take(1)).subscribe(ready => {
      if (ready) this.PlayerService.stopSong();
      else console.warn('Player not ready yet.');
    });
  }

  goBack() {
    this.router.navigate(['/top-artists']);
  }

  goToArtist(relatedArtistId: string) {
    this.router.navigate(['/artist'], { queryParams: { id: relatedArtistId } });
  }

  private buildArtist(details: any, albums: any, tracks: any) {
    this.artist.image = details.images[0].url;
    this.artist.images = details.images;
    this.artist.name = details.name;
    this.artist.genres = details.genres;
    this.artist.followers = details.followers.total;
    this.artist.popularity = details.popularity;
    this.artist.albums = albums.items;
    this.artist.topTracks = tracks.tracks.map((track, index) => ({
      name: track.name,
      image: track.album.images[0].url,
      artists: track.artists,
      id: track.id,
      autoPlay: index === 0 // only first track auto-plays
    }));
  }

  get visibleRelatedArtists() {
    return this.artist.relatedArtists.slice(this.currentRelatedArtistIndex, this.currentRelatedArtistIndex + 3);
  }

  nextRelatedArtists() {
    if (this.currentRelatedArtistIndex < this.artist.relatedArtists.length - 3) {
      this.currentRelatedArtistIndex++;
    } else {
      this.currentRelatedArtistIndex = 0;
    }
  }

  previousRelatedArtists() {
    if (this.currentRelatedArtistIndex > 0) {
      this.currentRelatedArtistIndex--;
    } else {
      this.currentRelatedArtistIndex = this.artist.relatedArtists.length - 3;
    }
  }
}
