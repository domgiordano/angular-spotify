import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  loading: boolean;
  profilePicture: string;
  userName: string;
  email: string; // Added email variable
  followersCount: number;
  user: any;
  accessToken: string;

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
    this.UserService.updateUserTable().pipe(take(1)).subscribe({
      next: data => {
        console.log("Updated USER Table------", data);
        this.loading = false;
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
