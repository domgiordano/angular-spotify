import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'portfolio/:name', component: PortfolioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
