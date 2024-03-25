import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerManagerService {
  progress!:HTMLInputElement;
  playBtn!:HTMLElement;
  audio!:HTMLAudioElement;

  theme!:object|any;
  currentTime:string = '0:00';
  duration:string = '-- : --';
  timeUpdate!:any;
  loop:boolean = true;

  constructor() {
    this.audio = new Audio();
    this.audio.volume = .2;
  }

  setTheme():void {
    this.audio.src = `../../../assets/music themes/${this.theme.name}.mp3`;
    this.playAudio();
  }

  getThemeData():object|any { return this.theme; }

  seekUpdate():void {  
    this.currentTime = this.formatTime(this.audio.currentTime);
    this.progress.value = (this.audio.currentTime * 100
      / this.audio.duration).toString();

    if (this.audio.currentTime == this.audio.duration) {
      this.audio.currentTime = 0;
      this.loop ? this.setTheme() : this.pauseAudio();
    }
  }

  seek(e:any):void {
    this.audio.currentTime = e.target.value * this.audio.duration / 100;
  }

  playAudio():void {
    this.audio.play();    
    setTimeout(() => this.duration = this.formatTime(this.audio.duration), 100);
    this.timeUpdate = setInterval(() => this.seekUpdate(), 50);
  }

  pauseAudio():void {
    this.audio.pause();
    clearInterval(this.timeUpdate);
  }

  formatTime(time:number|any):string {
    let min = Math.floor(time / 60);
    let seg:any = Math.floor(time % 60);
    if (seg < 10) seg = `0${seg}`;
    return `${min}:${seg}`;
  }
}
