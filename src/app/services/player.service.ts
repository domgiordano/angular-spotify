// src/app/services/player.service.ts
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements OnInit, OnDestroy {
  private player: any;
  private deviceId: string | null = null;
  private accessToken: string;
  private playerInitialized = false;
  private playerTransfered = false;
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.accessToken = this.authService.getAccessToken();
    this.loadSpotifySDK();
  }

  ngOnInit() {
    if (!this.playerTransfered) {
      this.transferPlaybackHere();
    }
  }

  private loadSpotifySDK(): void {
    if (this.playerInitialized) {
      return; // already set up
    }
    // If SDK already loaded, just init
    if ((window as any).Spotify) {
      this.initializePlayer();
      return;
    }

    // Otherwise, load the SDK script dynamically
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
    scriptTag.async = true;
    document.body.appendChild(scriptTag);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      this.initializePlayer();
    };
    this.playerInitialized = true;
  }

  private initializePlayer(): void {
    this.player = new (window as any).Spotify.Player({
      name: 'Xomify Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(this.accessToken);
      },
      volume: 0.5,
    });

    // Player ready
    this.player.addListener('ready', ({ device_id }: any) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
      // Force playback to this Angular app
      //this.transferPlaybackHere();
    });

    // Player went offline
    this.player.addListener('not_ready', ({ device_id }: any) => {
      console.log('Device ID has gone offline', device_id);
      this.deviceId = null;
    });

    // Connect the player
    this.player.connect();
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    });
  }

  playSong(trackId: string): void {
    if (!this.deviceId) {
      console.error('No active Spotify device yet.');
      return;
    }

    const body = { uris: [`spotify:track:${trackId}`] };

    this.http
      .put(
        `${this.baseUrl}/me/player/play?device_id=${this.deviceId}`,
        body,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: () => console.log(`Playing track ${trackId}`),
        error: (err) => console.error('Error playing track', err),
      });
  }

  stopSong(): void {
    if (!this.deviceId) {
      console.error('No active Spotify device yet.');
      return;
    }

    this.http
      .put(
        `${this.baseUrl}/me/player/pause?device_id=${this.deviceId}`,
        {},
        { 
          headers: this.getAuthHeaders(),
          responseType: 'text'
        }
      )
      .subscribe({
        next: () => console.log('Playback paused'),
        error: (err) => console.error('Error pausing track', err),
      });
  }

  transferPlaybackHere(): void {
    if (!this.deviceId) {
      console.error('No Spotify device ready to transfer playback.');
      return;
    }

    this.http
      .put(
        `${this.baseUrl}/me/player`,
        {
          device_ids: [this.deviceId],
          play: true, // start playing immediately
        },
        { 
          headers: this.getAuthHeaders(),
          responseType: 'text'
        }
      )
      .subscribe({
        next: () => {
          console.log('Playback transferred to Xomify app')
          this.playerTransfered = true;
        },
        error: (err) => console.error('Error transferring playback', err),
      });
  }
  ngOnDestroy() {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.playerInitialized = false;
    }
}
}
