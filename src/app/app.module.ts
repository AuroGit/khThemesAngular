import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WorldButtonComponent } from './components/world-button/world-button.component';
import { PlayerComponent } from './components/player/player.component';
import { RpgScreenComponent } from './components/rpg-screen/rpg-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldButtonComponent,
    PlayerComponent,
    RpgScreenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
