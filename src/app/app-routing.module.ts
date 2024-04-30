import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { TopSongsComponent } from './top-songs/top-songs.component';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { TopGenresComponent } from './top-genres/top-genres.component';
import { PlaylistGeneratorComponent } from './playlist-generator/playlist-generator.component';
import { WrappedComponent } from './wrapped/wrapped.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'top-songs', component: TopSongsComponent },
  { path: 'top-artists', component: TopArtistsComponent },
  { path: 'top-genres', component: TopGenresComponent },
  { path: 'playlist-generator', component: PlaylistGeneratorComponent },
  { path: 'wrapped', component: WrappedComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect empty path to /home
  { path: '**', redirectTo: '/home' } // Redirect all other paths to /home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
