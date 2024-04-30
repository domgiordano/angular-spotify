import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TopSongsComponent } from './top-songs/top-songs.component';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { TopGenresComponent } from './top-genres/top-genres.component';
import { PlaylistGeneratorComponent } from './playlist-generator/playlist-generator.component';
import { WrappedComponent } from './wrapped/wrapped.component';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MyProfileComponent,
    TopSongsComponent,
    TopArtistsComponent,
    TopGenresComponent,
    PlaylistGeneratorComponent,
    WrappedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
