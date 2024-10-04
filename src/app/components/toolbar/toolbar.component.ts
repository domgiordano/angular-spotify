// toolbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(
    private AuthService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    console.log("Toolbar locked n loaded.")
  }

  isLoggedIn(): boolean {
    return this.AuthService.isLoggedIn();
  }
  isSelected(route: string): boolean {
    return this.router.url === route;
  }
}
