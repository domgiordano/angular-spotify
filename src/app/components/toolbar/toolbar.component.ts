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
  dropdownOpen = false; // Track the state of the dropdown menu
  constructor(
    private AuthService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    console.log("Toolbar locked n loaded.")
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; // Toggle dropdown visibility
  }

  isLoggedIn(): boolean {
    return this.AuthService.isLoggedIn();
  }
  isSelected(route: string): boolean {
    return this.router.url === route;
  }
}
