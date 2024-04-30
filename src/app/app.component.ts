// Main
import { Component } from '@angular/core';
import { SpotifyService } from './spotify-service/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'XOMIFY';
  username: string = '';
  password: string = '';

  constructor(private spotifyService: SpotifyService) {}

  login() {
    this.spotifyService.login(this.username, this.password)
      .subscribe(
        (response: any) => { // Explicitly specifying 'response' as 'any'
          console.log('Login successful:', response);
          // Handle successful login, e.g., store access token in local storage
        },
        (error: any) => {
          console.error('Login failed:', error);
          // Handle login error
        }
      );
  }
}
