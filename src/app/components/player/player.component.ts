import { Component, ElementRef, ViewChild } from '@angular/core';
import { PlayerManagerService } from 'src/app/services/player-manager.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @ViewChild('progress') progress!:ElementRef;

  constructor (public playerManager:PlayerManagerService) { }

  ngAfterViewInit() {
    this.playerManager.progress = this.progress.nativeElement;
  }

  playPauseAudio():void {
    if (this.playerManager.theme) {
      let currentWorld = document.getElementById(this.playerManager.theme.name);
      if (this.playerManager.audio.paused) {
        this.playerManager.playAudio();
        currentWorld?.classList.add('floating');
      } else {
        this.playerManager.pauseAudio();
        currentWorld?.classList.remove('floating');
      }
    }
  }

  toggleLoop():void {  
    this.playerManager.loop = !this.playerManager.loop;
  }

  toggleMuteAudio():void {
    this.playerManager.audio.muted = !this.playerManager.audio.muted;
  }
}
