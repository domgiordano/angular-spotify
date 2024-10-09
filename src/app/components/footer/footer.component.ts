import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showDynamicButton: boolean = false;
  footerButtonText: string = '';
  githubRepoUrl: string = 'https://github.com/domgiordano/angular-spotify'

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // Example logic to show/hide button based on the route
      if (url.includes('/artist')) {
        this.showDynamicButton = true;
        this.footerButtonText = 'Go Back';
      } else if (url.includes('/top-songs')) {
        this.showDynamicButton = true;
        this.footerButtonText = 'Download Playlist';
      } else {
        this.showDynamicButton = false;
      }
    });
  }

  handleDynamicButtonClick() {
    const url = this.router.url;

    if (url.includes('/artist')) {
      this.router.navigate(['/top-artists']);
    } else if (url.includes('/top-songs')) {
      console.log('See Stats button clicked');
    }
  }
  openGitHubRepo() {
    // Open the GitHub repository URL in a new tab
    window.open(this.githubRepoUrl, '_blank');
  }
}
