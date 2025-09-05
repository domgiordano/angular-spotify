// src/app/services/player.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
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

  private loadSpotifySDK(): void {
    if (this.playerInitialized) return;

    if ((window as any).Spotify) {
      this.initializePlayer();
    } else {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
      scriptTag.async = true;
      document.body.appendChild(scriptTag);

      (window as any).onSpotifyWebPlaybackSDKReady = () => {
        this.initializePlayer();
      };
    }

    this.playerInitialized = true;
  }

  private initializePlayer(): void {
    if (this.player) return; // prevent double initialization

    this.player = new (window as any).Spotify.Player({
      name: 'Xomify Player',
      getOAuthToken: (cb: (token: string) => void) => cb(this.accessToken),
      volume: 0.5,
    });

    this.player.addListener('ready', ({ device_id }: any) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
      if (!this.playerTransfered) {
        this.transferPlaybackHere(false); // don't auto-play if not needed
      }
    });

    this.player.addListener('not_ready', ({ device_id }: any) => {
      console.log('Device offline', device_id);
      this.deviceId = null;
    });

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

    this.http
      .put(
        `${this.baseUrl}/me/player/play?device_id=${this.deviceId}`,
        { uris: [`spotify:track:${trackId}`] },
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: () => console.log(`Playing track ${trackId}`),
        error: (err) => console.error('Error playing track', err),
      });
  }

  stopSong(): void {
    if (!this.deviceId) return;

    this.http
      .put(
        `${this.baseUrl}/me/player/pause?device_id=${this.deviceId}`,
        {},
        { headers: this.getAuthHeaders(), responseType: 'text' }
      )
      .subscribe({
        next: () => console.log('Playback paused'),
        error: (err) => console.error('Error pausing track', err),
      });
  }

  transferPlaybackHere(playImmediately = true): void {
    if (!this.deviceId || this.playerTransfered) return;

    this.http
      .put(
        `${this.baseUrl}/me/player`,
        { device_ids: [this.deviceId], play: playImmediately },
        { headers: this.getAuthHeaders(), responseType: 'text' }
      )
      .subscribe({
        next: () => {
          console.log('Playback transferred to Xomify app');
          this.playerTransfered = true;
        },
        error: (err) => console.error('Error transferring playback', err),
      });
  }

  // Optional cleanup if app fully unloads
  disconnectPlayer(): void {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.playerInitialized = false;
      this.playerTransfered = false;
    }
  }
}
