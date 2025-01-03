import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';
import { Router } from '@angular/router';

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
  topSongs: any[] = [];
  currentImageIndex: number = 0;
  audio = new Audio();
  currentRelatedArtistIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ArtistService: ArtistService,
    private ToastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.artistId = params['id'];
      this.loadArtistDetails(this.artistId);
      this.artist.id = this.artistId;
    });
  }

  loadArtistDetails(artistId: string) {
    this.loading = true;
    if (artistId) {
      const artistCalls = forkJoin({
        detailsResp: this.ArtistService.getArtistDetails(artistId),
        albumsResp: this.ArtistService.getArtistAlbums(artistId),
        tracksResp: this.ArtistService.getArtistTopTracks(artistId),
        relatedResp: this.ArtistService.getArtistRelatedArtists(artistId)
      });

      return artistCalls.pipe(take(1)).subscribe({
        next: data => {
          this.buildArtist(data.detailsResp, data.albumsResp, data.tracksResp, data.relatedResp);
        },
        error: err => {
          console.error('Error fetching artist', err);
          this.ToastService.showNegativeToast('Error adding songs to playlist');
          this.loading = false;
        },
        complete: () => {
          this.loading = false
          console.log('Artist Loaded.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/top-artists']);
  }

  goToArtist(relatedArtistId: string) {
    this.router.navigate(['/artist'], { queryParams: { id: relatedArtistId } });
  }

  playPreview(previewUrl: string) {
    this.stopPreview();
    this.audio.src = previewUrl;
    this.audio.play();
  }

  stopPreview() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  private buildArtist(details: any, albums: any, tracks: any, relatedArtists: any) {
    this.artist.image = details.images[0].url;
    this.artist.images = details.images;
    this.artist.name = details.name;
    this.artist.genres = details.genres;
    this.artist.followers = details.followers.total;
    this.artist.popularity = details.popularity;
    this.artist.albums = albums.items;
    this.artist.topTracks = tracks.tracks.map(track => ({
      name: track.name,
      image: track.album.images[0].url,
      artists: track.artists,
      previewUrl: track.preview_url
    }));
    this.artist.relatedArtists = relatedArtists.artists.map(artist => ({
      name: artist.name,
      image: artist.images[0].url,
      id: artist.id
    }));
  }

  formatArtists(artists: any[]): string {
    return artists.map(artist => artist.name).join(', ');
  }

  get visibleRelatedArtists() {
    return this.artist.relatedArtists.slice(this.currentRelatedArtistIndex, this.currentRelatedArtistIndex + 3);
  }

  nextRelatedArtists() {
    if (this.currentRelatedArtistIndex < this.artist.relatedArtists.length - 3) {
      this.currentRelatedArtistIndex++;
    } else {
      this.currentRelatedArtistIndex = 0; // Reset to the beginning for infinite scroll
    }
  }

  previousRelatedArtists() {
    if (this.currentRelatedArtistIndex > 0) {
      this.currentRelatedArtistIndex--;
    } else {
      this.currentRelatedArtistIndex = this.artist.relatedArtists.length - 3; // Reset to the end for infinite scroll
    }
  }

  isNextDisabled() {
    return this.artist.relatedArtists.length <= 3;
  }

  isPreviousDisabled() {
    return this.artist.relatedArtists.length <= 3;
  }
}
