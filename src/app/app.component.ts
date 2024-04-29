// Main
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-skeleton';
  username: string = '';
  password: string = '';

  login() {
    // Implement your login logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}
