import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service'; // Service to handle user info and authentication
import { WrappedService } from 'src/app/services/wrapped.service';

@Component({
  selector: 'app-wrapped',
  templateUrl: './wrapped.component.html',
  styleUrls: ['./wrapped.component.scss'],
})
export class WrappedComponent implements OnInit {
  userEmail: string;
  refreshToken: string;
  hasOptedIn: boolean = false;
  hasData: boolean = false;
  firstMonth: boolean = false;
  topSongs: any[] = [];
  topArtists: any[] = [];

  constructor(
    private UserService: UserService,
    private WrappedService: WrappedService,
    private AuthService: AuthService
    ) {}

  ngOnInit() {
    this.userEmail = this.UserService.getEmail()
    this.refreshToken = this.AuthService.getRefreshToken();
    this.loadUserData();
  }

  loadUserData() {
    // Check if the user has opted in
    this.WrappedService.getUserWrappedData(this.userEmail).subscribe({
      next: (status) => {
        this.hasOptedIn = status;
      },
      error: (err) => {
        console.error('Error fetching opt-in status:', err);
      }
    });
  }

  signUpForWrapped() {
    // Call the API to sign the user up for monthly wrapped
    this.WrappedService.optInUserForWrapped(this.userEmail, this.refreshToken).subscribe({
      next: () => {
        this.hasOptedIn = true;
      },
      error: (err) => {
        console.error('Error opting in:', err);
      }
    });
  }

  getIndicatorClass(rankChange: number): string {
    if (rankChange > 0) {
      return 'green-arrow'; // Class for increased rank
    } else if (rankChange < 0) {
      return 'red-arrow'; // Class for decreased rank
    } else {
      return 'grey-arrow'; // Class for no change
    }
  }

}
