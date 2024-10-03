// toolbar.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log("Toolbar locked n loaded.")
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
