import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { TopSongsComponent } from './pages/top-songs/top-songs.component';
import { TopArtistsComponent } from './pages/top-artists/top-artists.component';
import { TopGenresComponent } from './pages/top-genres/top-genres.component';
import { PlaylistGeneratorComponent } from './pages/playlist-generator/playlist-generator.component';
import { WrappedComponent } from './pages/wrapped/wrapped.component';
import { AppComponent } from './app.component';
import { CallbackComponent } from './components/callback/callback.component';
import { HomeComponent } from './pages/home/home.component';
import { ArtistProfileComponent } from './pages/artist-profile/artist-profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'top-songs', component: TopSongsComponent },
  { path: 'top-artists', component: TopArtistsComponent },
  { path: 'top-genres', component: TopGenresComponent },
  { path: 'playlist-generator', component: PlaylistGeneratorComponent },
  { path: 'wrapped', component: WrappedComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'artist', component: ArtistProfileComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect empty path to /home
  { path: '**', redirectTo: '/home' } // Redirect all other paths to /home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
