import { Component, EventEmitter, Output } from '@angular/core';
import data from '../../../assets/rpg-data.json';

@Component({
  selector: 'rpg-screen',
  templateUrl: './rpg-screen.component.html',
  styleUrls: ['./rpg-screen.component.css',
  './animations.css', './rpg-main.css', './rpg-footer.css']
})
export class RpgScreenComponent {
  @Output() resultEvent = new EventEmitter<string>();
  result:string = '';
  screenId:string|number = 0;
  rpgData = {...data[0], team:[], enemy:{}};

  sprites:object|any;
  shiftArr:object|any;
  team:object|any;
  enemy:object|any;

  currentShift:object|any;
  canPlay:boolean = true;
  options:string = '';
  info:string = 'Derrota al Encapuchado';
  savedInfo:string = this.info;
  canSelect:boolean = false;
  charElems:object|any;
  selectionCB?(char:object|any):void;

  constructor() {
    this.rpgData.enemy = Object.assign({}, data[0].enemy);
    data[0].team.forEach((item:any) => {
      this.rpgData.team.push(Object.assign({},item));
    });
    
    this.sprites = {
      enemy: this.rpgData.enemy.url,
      team: [
        this.rpgData.team[0].url,
        this.rpgData.team[1].url,
        this.rpgData.team[2].url
      ],
      bg: ""
    };
    
    this.shiftArr = [
      ...this.rpgData.team,
      this.rpgData.enemy
    ]
    this.shiftArr.sort(() => Math.random() - .5);
    this.currentShift = this.shiftArr[0];
    console.log(this.shiftArr);
    console.log(this.currentShift.name);
    
    this.team = [...this.rpgData.team];
    this.team.map((char:any) => {      
      char.isDead = false;
      char.protection = 'unprotected';
      char.stats = Object.assign({}, char.stats)
      char.stats = { ...char.stats, maxHp: char.stats.hp,
        maxMp: char.stats.mp }
    });
    
    this.enemy = {...this.rpgData.enemy};
    this.enemy.stats = {...this.enemy.stats, maxHp: this.enemy.stats.hp}
  }

  showOptions(str:string):void {
    this.canSelect = false;
    this.options = str;
  }

  // rpgFunctions
  attack():void {
    this.canPlay = false;
    this.options = '';
    this.canSelect = false;
    this.info = this.currentShift.name.replace(/\b\w/g, (s: string) => s.toUpperCase())
    + ' ataca a ' + this.enemy.name.replace(/\b\w/g, (s: string) => s.toUpperCase());
    
    // CharAtk sprite
    this.charElems[this.currentShift.name]
      .classList.add('attack');

    setTimeout(() => {
      // Damage calc
      let damage = this.currentShift.stats.atk - this.enemy.stats.dfs > 0 ?
        this.currentShift.stats.atk - this.enemy.stats.dfs : 1;      
      this.enemy.stats.hp -= damage;
      if (this.enemy.stats.hp <= 0) this.enemy.stats.hp = 0;
      this.charElems[this.currentShift.name]
        .classList.remove('attack');
      
      this.charElems.enemy.classList
        .add('physicalDmg', 'dmg');
      this.charElems.enemy.querySelector('.fx')
        .setAttribute('style', 'visibility:visible');
      
      //EnemyDmg sprite
      setTimeout(() => {
        this.charElems.enemy.classList
          .remove('physicalDmg', 'dmg');
        this.charElems.enemy.querySelector('.fx')
          .removeAttribute('style');

        this.nextShift();
      }, 1000);
    }, 1000);
  }
  castSpell(spell:object|any):void {
    this.canPlay = false;
    this.options = '';
    switch (spell.type) {
      case 'damage':
        this.info = this.currentShift.name.replace(/\b\w/g, (s: string) => s.toUpperCase())
        + ' lanza ' + spell.name + ' a ' + this.enemy.name.replace(/\b\w/g, (s: string) => s.toUpperCase());

        // MP pay
        this.currentShift.stats.mp -= spell.cost;
        if (this.currentShift.stats.mp <= 0) this.currentShift.stats.mp = 0;

        // CharAtk sprite
        this.charElems[this.currentShift.name]
          .classList.add(spell.effect);
        
        setTimeout(() => {
          // Damage calc
          let damage = this.currentShift.stats.mgAtk - this.enemy.stats.mgDfs > 0 ?
            this.currentShift.stats.mgAtk - this.enemy.stats.mgDfs : 1;      
          this.enemy.stats.hp -= damage;
          if (this.enemy.stats.hp <= 0) this.enemy.stats.hp = 0;
          this.charElems[this.currentShift.name]
            .classList.remove(spell.effect);
          
          this.charElems.enemy.classList
            .add(`${spell.effect}Dmg`, 'dmg');
          this.charElems.enemy.querySelector('.fx')
            .setAttribute('style', 'visibility:visible');
          
          //EnemyDmg sprite
          setTimeout(() => {
            this.charElems.enemy.classList
              .remove(`${spell.effect}Dmg`, 'dmg');
            this.charElems.enemy.querySelector('.fx')
              .removeAttribute('style');

            this.nextShift();
          }, 500);
        }, 1000);
        break;

      case 'defense':
        this.info = `¿En quien quieres usar ${spell.name}?`;
        this.canSelect = true;
        this.selectionCB = (char:object|any) => {
          this.info = `El hechizo ${spell.name} protege a `
          + char.name.replace(/\b\w/g, (s: string) => s.toUpperCase());
          
          this.currentShift.stats.mp -= spell.cost;
          if (this.currentShift.stats.mp <= 0) this.currentShift.stats.mp = 0;
          
          switch (spell.effect) {
            case 'physic':
              char.protection == 'magic' ?
              char.protection = 'full' : char.protection = 'physic';
              break;
            case 'magic':
              char.protection == 'physic' ?
              char.protection = 'full' : char.protection = 'magic';
              break;
          }
          this.canSelect = false;
          this.options = ''; 
        };
        break;

      case 'health':      
        this.info = `¿A quien le das ${spell.name}?`;
        this.canSelect = true;
        this.selectionCB = (char:object|any) => {
          this.info = char.name.replace(/\b\w/g, (s: string) => s.toUpperCase())
          + ' ha recuperado VT';

          // CharItem sprite
          this.charElems[this.currentShift.name]
          .classList.add('heal');

          setTimeout(() => {        
            this.charElems[this.currentShift.name]
              .classList.remove('heal');
              
            //Allay sprite
            this.charElems[char.name].classList
              .add(`${spell.effect}`);
            this.charElems[char.name].querySelector('.fx')
              .setAttribute('style', 'visibility:visible');
            
            setTimeout(() => {
              // Stats calc
              this.currentShift.stats.mp -= spell.cost;
              if (this.currentShift.stats.mp <= 0) this.currentShift.stats.mp = 0;
              if (char.stats.hp == 0) char.isDead = false;
              char.stats.hp += Math.round(char.stats.maxHp / 3);
              if (char.stats.hp > char.stats.maxHp) char.stats.hp = char.stats.maxHp;

              this.charElems[char.name].classList
                .remove(spell.effect);
              this.charElems[char.name].querySelector('.fx')
                .removeAttribute('style');

              this.nextShift();
            }, 1000);
          }, 1000);

          this.canSelect = false;
          this.options = '';
        }
        break;
    }
  }
  useSkill(skill:object|any):void {
    this.canPlay = false;
    this.info = this.currentShift.name.replace(/\b\w/g, (s: string) => s.toUpperCase())
    + ' usa ' + skill.name + ' contra ' + this.enemy.name.replace(/\b\w/g, (s: string) => s.toUpperCase());

    // MP pay
    this.currentShift.stats.mp -= skill.cost;
    if (this.currentShift.stats.mp <= 0) this.currentShift.stats.mp = 0;

    // CharAtk sprite
    this.charElems[this.currentShift.name]
      .classList.add(skill.effect);
    
    setTimeout(() => {
      // Damage calc
      let damage = skill.power - this.enemy.stats.dfs > 0 ?
        skill.power - this.enemy.stats.dfs : 1;      
      this.enemy.stats.hp -= damage;
      if (this.enemy.stats.hp <= 0) this.enemy.stats.hp = 0;
      this.charElems[this.currentShift.name]
        .classList.remove(skill.effect);
      
      this.charElems.enemy.classList
        .add(`${skill.effect}Dmg`, 'dmg');
      this.charElems.enemy.querySelector('.fx')
        .setAttribute('style', 'visibility:visible');
      
      //EnemyDmg sprite
      setTimeout(() => {
        this.charElems.enemy.classList
          .remove(`${skill.effect}Dmg`, 'dmg');
        this.charElems.enemy.querySelector('.fx')
          .removeAttribute('style');

        this.nextShift();
      }, 1000);
    }, 1000);

    this.options = '';
  }
  useItem(item:any):void {
    this.canPlay = false;
    this.info = `¿A quien le das ${item.name}?`;
    this.canSelect = true;
    this.selectionCB = (char:object|any) => {
      this.info = `Has dado ${item.name} a ${char.name.replace(/\b\w/g, (s: string) => s.toUpperCase())}`;
      item.amount--;
      
      // CharItem sprite
      this.charElems[this.currentShift.name]
      .classList.add('useItem');
    
      setTimeout(() => {        
        this.charElems[this.currentShift.name]
          .classList.remove('useItem');
        
        this.charElems[char.name].classList
          .add(`${item.effect}`);
        this.charElems[char.name].querySelector('.fx')
          .setAttribute('style', 'visibility:visible');
        
        setTimeout(() => {
          // Stats calc
          switch (item.effect) {
            case 'hp':
              if (char.stats.hp == 0) char.isDead = false;
              char.stats.hp += char.stats.maxHp * item.power;
              if (char.stats.hp > char.stats.maxHp) char.stats.hp = char.stats.maxHp;
              break;
          
            case 'mp':
              char.stats.mp += char.stats.maxMp * item.power;
              if (char.stats.mp > char.stats.maxMp) char.stats.mp = char.stats.maxMp;
              break;
            
            case 'both':
              if (char.stats.hp == 0) char.isDead = false;
              char.stats.hp += char.stats.maxHp * item.power;
              if (char.stats.hp > char.stats.maxHp) char.stats.hp = char.stats.maxHp;
              char.stats.mp += char.stats.maxMp * item.power;
              if (char.stats.mp > char.stats.maxMp) char.stats.mp = char.stats.maxMp;
              break;
          }

          this.charElems[char.name].classList
            .remove(`${item.effect}`);
          this.charElems[char.name].querySelector('.fx')
            .removeAttribute('style');

          this.nextShift();
        }, 1000);
      }, 1000);
      
      this.canSelect = false;
      this.options = ''; 
    }
  }
  selectChar(char:object|any):void {
    if (this.selectionCB) {
      this.selectionCB(char);
    }
  }
  cancelSelect():void {
    this.canPlay = true;
    this.canSelect = false;
    this.options = '';
  }

  enemyAttack():void {
    this.canPlay = false;
    let _moveset = [
      {type:'atk', range:'1'},
      {type:'mg', range:'all'}
    ];
    let move = _moveset[Math.floor(Math.random()*2)];
    let teamAlive = this.team.filter((char:any) => {
      if (!char.isDead) return char;
    });
    let target:any;
    
    switch (move.range) {
      case '1':
        target = [teamAlive[Math.floor(Math.random()*teamAlive.length)]];
        this.info = this.enemy.name.replace(/\b\w/g, (s: string) => s.toUpperCase())
        + ' ataca a ' + target[0].name.replace(/\b\w/g, (s: string) => s.toUpperCase());
        break;
      case 'all':
        target = teamAlive;
        this.info = this.enemy.name.replace(/\b\w/g, (s: string) => s.toUpperCase())
        + ' ataca a todo el grupo';
        break;
    }
    switch (move.type) {
      case 'atk':      
        this.charElems.enemy?.classList.add('attack');
        setTimeout(() => {
          this.charElems.enemy?.classList.remove('attack');
          this.charElems[target[0].name].classList
            .add('physicalDmg', 'dmg');
          this.charElems[target[0].name].querySelector('.fx')
            .setAttribute('style', 'visibility:visible');

          // Damage calc
          target.forEach((char:any) => {
            if (char.protection == 'unprotected' || char.protection == 'magic') {
              char.stats.hp -= this.enemy.stats.atk - char.stats.dfs;
              if (char.stats.hp < 0) {
                char.stats.hp = 0;
                char.isDead = true;
              }
            } else if (char.protection == 'full') {
              char.protection = 'magic'
            }else if (char.protection == 'physic') {
              char.protection = 'unprotected';
            }
          });

          //CharDmg sprite
          setTimeout(() => {
            this.charElems[target[0].name].classList
              .remove('physicalDmg', 'dmg');
            this.charElems[target[0].name].querySelector('.fx')
              .removeAttribute('style');

            this.nextShift();
          }, 1000);
        }, 1000);
        break;

      case 'mg':
        this.info = this.info.replace('ataca', 'lanza Oscuridad');

        this.charElems.enemy?.classList.add('dark');
        setTimeout(() => {
          this.charElems.enemy?.classList.remove('dark');

          target.forEach((char:any) => {
            this.charElems[char.name].classList
              .add('darkDmg', 'dmg');
            this.charElems[char.name].querySelector('.fx')
              .setAttribute('style', 'visibility:visible');

            if (char.protection == 'unprotected' || char.protection == 'physic') {
              char.stats.hp -= this.enemy.stats.mgAtk - char.stats.mgDfs;
              if (char.stats.hp < 0) {
                char.stats.hp = 0;
                char.isDead = true;
              }
            } else if (char.protection == 'full') {
              char.protection = 'physic';
            } else if (char.protection == 'magic') {
              char.protection = 'unprotected';
            }
          });

          //CharDmg sprite
          setTimeout(() => {
            target.forEach((char:any) => {
              this.charElems[char.name].classList
                .remove('darkDmg', 'dmg');
              this.charElems[char.name].querySelector('.fx')
                .removeAttribute('style');
            });
            this.nextShift();
          }, 1000);
        }, 1000);
        break;
    }    
  }

  nextShift():void {
    this.info = this.savedInfo;
    //Endgame
    let teamAlive = this.team.filter((char:any) => {
      if (!char.isDead) return char;
    });
    
    if (teamAlive.length == 0 || this.enemy.stats.hp == 0) {
      if (teamAlive.length == 0) { this.result = 'lost' }
      if (this.enemy.stats.hp == 0) {
        setTimeout(() => {
          this.result = 'won';
          return;
        }, 2000);
      }
    }

    // Still Alive > Next Shift
    this.canPlay = true;
    let nextIndex = this.shiftArr.indexOf(this.currentShift) < 3 ?
      this.shiftArr.indexOf(this.currentShift) + 1 : 0;
    while (this.shiftArr[nextIndex].isDead) {
      nextIndex < 3 ? nextIndex++ : nextIndex = 0;
    }
    this.currentShift = this.shiftArr[nextIndex];
    if (this.currentShift == this.rpgData.enemy
      && this.enemy.stats.hp > 0) {
        this.enemyAttack();
    }
  }

  endgame():void {
    this.resultEvent.emit(this.result);
    document.getElementById('rpg')?.classList.add('fadeout');
  }

  // Info updating onHover
  onHover(str:any):void { this.info = str; }
  onLeave():void { this.info = this.savedInfo; }

  ngAfterViewInit() {
    const charSprites = document.querySelectorAll('.char-sprite')
    this.charElems = {
      donald: charSprites[0], sora: charSprites[1],
      goofy: charSprites[2], enemy: charSprites[3]
    };
    
    if (this.currentShift.name == this.enemy.name) {
      setTimeout(() => this.enemyAttack(),2000);
    }
  }
}
