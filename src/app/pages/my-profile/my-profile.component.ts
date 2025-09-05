import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, OnDestroy {
  loading: boolean;
  profilePicture: string;
  userName: string;
  email: string; // Added email variable
  followersCount: number;
  user: any;
  accessToken: string;
  wrappedEnrolled: boolean = false;
  releaseRadarEnrolled: boolean = false;
  tableEntryUser;

  constructor(
    private AuthService: AuthService,
    private UserService: UserService,
    private ToastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.accessToken = this.AuthService.getAccessToken();
    this.userName = this.UserService.getUserName();
    if ( this.userName.length === 0 ){
      console.log("Need User.");
      this.loadUser();
    }
    else{
      console.log("We got dat user.");
      this.user = this.UserService.getUser();
      this.userName = this.UserService.getUserName();
      this.profilePicture = this.UserService.getProfilePic();
      this.email = this.UserService.getEmail();
      this.followersCount = this.UserService.getFollowers();
      this.wrappedEnrolled = this.UserService.getWrappedEnrollment();
      this.releaseRadarEnrolled = this.UserService.getReleaseRadarEnrollment();
      this.tableEntryUser.activeWrapped = this.wrappedEnrolled;
      this.tableEntryUser.activeReleaseRadar = this.releaseRadarEnrolled;
    }
  }

  loadUser() {
    this.loading = true;
    this.UserService.getUserData().pipe(take(1)).subscribe({
      next: data => {
        console.log("USER------",data);
        this.UserService.setUser(data);
        this.user = this.UserService.getUser();
        this.userName = this.UserService.getUserName();
        this.profilePicture = this.UserService.getProfilePic();
        this.email = this.UserService.getEmail();
        this.followersCount = this.UserService.getFollowers();
        this.loading = false;
        // Update User Table
        this.updateUserTable()
      },
      error: err => {
        console.error('Error fetching User', err);
        this.ToastService.showNegativeToast('Error fetching User');
        this.loading = false;
      },
      complete: () => {
        console.log('User Loaded.');
      }
    });

  }

  updateUserTable() {
    console.log('Updating User Table ...'); 
    this.UserService.updateUserTableRefreshToken().pipe(take(1)).subscribe({
      next: xomUser => {
        console.log("Updated Xomify USER Table------", xomUser);
        this.tableEntryUser = xomUser;
        this.wrappedEnrolled = xomUser.activeWrapped;
        this.releaseRadarEnrolled = xomUser.activeReleaseRadar;
        this.loading = false;
        this.UserService.setReleaseRadarEnrollment(this.releaseRadarEnrolled);
        this.UserService.setWrappedEnrollment(this.wrappedEnrolled);
      },
      error: err => {
        console.error('Error Updating User Table', err);
        this.ToastService.showNegativeToast('Error Updating User Table');
        this.loading = false;
      },
      complete: () => {
        console.log('User Table Updated.');
      }
    });

  }

  toggleWrapped() {
    console.log("Toggling Wrapped Enrollment...")
    this.wrappedEnrolled = !this.wrappedEnrolled;
  }

  toggleReleaseRadar() {
    console.log("Toggling Release Radar Enrollment...")
    this.releaseRadarEnrolled = !this.releaseRadarEnrolled;
  }
  ngOnDestroy(): void {
    if (this.tableEntryUser.activeWrapped != this.wrappedEnrolled || 
      this.tableEntryUser.activeReleaseRadar != this.releaseRadarEnrolled) {
        console.log("Found updated enrollment - Wrapped or Release Radar or Both!")
        this.UserService.updateUserTableEnrollments(this.wrappedEnrolled, this.releaseRadarEnrolled).pipe(take(1)).subscribe({
          next: xomUser => {
            console.log("Updated Xomify USER Table------", xomUser);
            this.UserService.setReleaseRadarEnrollment(this.releaseRadarEnrolled);
            this.UserService.setWrappedEnrollment(this.wrappedEnrolled);
          },
          error: err => {
            console.error('Error Updating User Table', err);
            this.ToastService.showNegativeToast('Error Updating User Table');
            this.loading = false;
          },
          complete: () => {
            console.log('User Table Updated.');
          }
        });
      }
  }
}
