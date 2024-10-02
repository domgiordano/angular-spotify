// Main
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'XOMIFY';
  username: string = '';
  password: string = '';

  constructor(private AuthService: AuthService) {}

  login(): void {
    this.AuthService.login();
  }

}
