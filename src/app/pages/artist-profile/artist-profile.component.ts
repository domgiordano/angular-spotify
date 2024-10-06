import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';
import { Router } from '@angular/router';

import { forkJoin, take } from 'rxjs';

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
  currentImageIndex: number = 0; // To track the currently displayed image
  audio = new Audio();
  currentRelatedArtistIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ArtistService: ArtistService
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
      // Fetch artist details and top songs
      const artistCalls = forkJoin({
        detailsResp: this.ArtistService.getArtistDetails(artistId),
        albumsResp: this.ArtistService.getArtistAlbums(artistId),
        tracksResp: this.ArtistService.getArtistTopTracks(artistId),
        relatedResp: this.ArtistService.getArtistRelatedArtists(artistId)
      });

      return artistCalls.pipe(take(1)).subscribe({
        next: data => {
          this.loading = false;
          console.log("Artist Data FOUND ------");
          console.log(data);
          this.buildArtist(data.detailsResp, data.albumsResp, data.tracksResp, data.relatedResp);
        },
        error: err => {
          console.error('Error fetching artist', err);
          this.loading = false;
        },
        complete: () => {
          console.log('Artist Loaded.');
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['/top-artists']);
  }
  goToArtist(relatedArtistId: string) {
    // Navigate to the related artist profile page with artistId as a query param
    this.router.navigate(['/artist'], { queryParams: { id: relatedArtistId } });
  }

  playPreview(previewUrl: string) {
    this.stopPreview(); // Stop any currently playing track
    this.audio.src = previewUrl; // Set the new source
    this.audio.play(); // Start playing
  }

  stopPreview() {
    this.audio.pause(); // Pause the audio
    this.audio.currentTime = 0; // Reset playback position
  }

  private buildArtist(details: any, albums: any, tracks: any, relatedArtists: any){
    this.artist.image = details.images[0].url;
    this.artist.images = details.images;
    this.artist.name = details.name;
    this.artist.genres = details.genres;
    this.artist.followers = details.followers.total;
    this.artist.popularity = details.popularity;
    this.artist.albums = albums.items;
    let topTracks = [];
    for(let track of tracks.tracks){
      topTracks.push({
        name: track.name,
        image: track.album.images[0].url,
        artists: track.artists,
        previewUrl: track.preview_url
      })
    }
    this.artist.topTracks = topTracks;
    let relArtists = [];
    for(let artist of relatedArtists.artists){
      relArtists.push({
        name: artist.name,
        image: artist.images[0].url,
        id: artist.id
      })
    }
    this.artist.relatedArtists = relArtists;
    console.log("ARTIST--------", this.artist);
  }
  formatArtists(artists: any[]): string {
    return artists.map(artist => artist.name).join(', ');
  }

  get visibleRelatedArtists() {
    return this.artist.relatedArtists.slice(this.currentRelatedArtistIndex, this.currentRelatedArtistIndex + 3);
  }

  nextRelatedArtists() {
    if (this.currentRelatedArtistIndex < this.artist.relatedArtists.length - 3) {
      this.currentRelatedArtistIndex += 1;
    }
  }

  previousRelatedArtists() {
    if (this.currentRelatedArtistIndex > 0) {
      this.currentRelatedArtistIndex -= 1;
    }
  }
}
