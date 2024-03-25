import { Component, ElementRef, ViewChild } from '@angular/core';
import data from '../assets/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('audio') audio!:ElementRef;
  worldData = data;
  currentTheme:object|any;
  worldToUnlock:string = '';

  handleSelection(theme:object|any):void {
    this.currentTheme = theme;
  }

  handleStartGame(e:string) {
    this.worldToUnlock = e;
  }

  handleEndGame(res:string):void {
    if (res == 'won') {    
      let [currentWorld] = this.worldData.filter((item:any)=> {
        if (item.name == this.worldToUnlock) {
          return item;
        }
      });
      currentWorld.type = 'default';
    }
    setTimeout(() => this.worldToUnlock = '', 1000);
  }
}
