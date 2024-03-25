import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerManagerService } from 'src/app/services/player-manager.service';

@Component({
  selector: 'world-button',
  templateUrl: './world-button.component.html',
  styleUrls: ['./world-button.component.css']
})
export class WorldButtonComponent {
  @Input() world:object|any;
  @Output() startGame = new EventEmitter<string>();
  floatingClass:boolean = false;

  constructor(private playerManager:PlayerManagerService) { }

  playTheme():void {
    let currentWorld = document.querySelector('.world-btn.floating');
    currentWorld?.classList.remove('floating');
    this.playerManager.theme = this.world;
    this.playerManager.setTheme();
    this.floatingClass = true;    
  }

  unlockWorld (world:string):void {
    if (this.world.type == 'secret') this.world.name = 'mickey-remind';
    // this.world.type = 'default';

    this.startGame.emit(world);
  }
}
