import { Component, HostListener } from '@angular/core';
import { iif, Subject } from 'rxjs';
import { DamageConfiguration } from "f:/_git-repos/Smite me/smite-the-dragon/src/app/tab1/DamageConfiguration"

enum Smited {
  byNoone,
  byPlayer,
  byEnemy
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
//export class Tab1Page {
export class TabPractice {

  dragonMaxHealth: number = 4000;
  dragonCurrentHealth: number = 4000;
  smiteDamage: number = 1000;

  //Simulates random damage done to dragon
  randomMiniDamageMin: number = 50;
  randomMiniDamageMax: number = 100;
  randomLargeDamageMin: number = 100;
  randomLargeDamageMax: number = 250;

  //Simulates a dot being applied to dragon
  dotDamageTick: number = 10;
  dotDamageTickInterval: number = 1;

  //Delay after enemy smites dragon
  enemySmiteDelay: number = 1000;

  randomMiniDamageInterval: number = 100; // in miliseconds
  randomLargeDamageInterval: number = 100; // in miliseconds

  damageOngoing: boolean = false;

  intervals = new Array();
  timeouts = new Array();

  damageConf: DamageConfiguration = {
    cdrt:
      [
        //    { damage: 100, intervalMin: 500, intervalMax: 1000,  }
      ],
    cdct:
      [
        //     { damage: 10, interval: 200 }
      ],
    rdrt:
      [
        { damageMin: 200, damageMax: 500, intervalMin: 500, intervalMax: 5000 },
        { damageMin: 20, damageMax: 20, intervalMin: 300, intervalMax: 1000 },
        { damageMin: 1, damageMax: 10, intervalMin: 100, intervalMax: 150 },
        { damageMin: 1, damageMax: 1000, intervalMin: 4000, intervalMax: 10000 },
      ],
    rdct:
      [
        //    {  damageMin: 100, damageMax: 300, interval: 4000 }
      ],
  };

  scalingFactor: number = 1;

  timeTillDeath: number = 0;

  startTime: number = 0;
  endTime: number = 0;

  startTimer: number = 0;

  doConstantIntervalDamage: boolean = true;
  doRandomIntervalDamage: boolean = true;

  gameRunning: boolean = false;

  firstConstantDamageInterval: boolean = true;
  firstRandomDamageInterval: boolean = true;
  
  winningText: string = "winner";
  losingText: string = "losser";

  endgameWon: boolean = false;
  endgameLoss: boolean = false;

  stealerName: string = "Lee Sin";
  enemyReactionTime: number = 500; //in miliseconds
  
  smiteReactionStartTime: number = 0;
  mySmiteTime: number = 0;
  enemySmiteTime: number = 0;

  competitionStarted:boolean = false;


  constructor() {}

  @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      let x = event.key;
      if (x === 'f' || x === 'd') {
        this.smiteDragonClick();
      }
  }   

  engageStart(){
    this.gameRunning = true;
    this.resetGame();
    var i = setInterval(() => {
      //Starts interval for countdown, when countdown is completed, the game damage loop starts and countdown interval is canceled
      if(this.startTimer <= 0){
        clearInterval(i);
        this.damageOngoing = true;
        this.initiateDragonDamageLoop();
      }
      this.startTimer -= 1;
    }, 1000)
  }

  initiateDragonDamageLoop() {
    if (this.doConstantIntervalDamage)
      this.initiateConstantIntervalDamage();
    if (this.doRandomIntervalDamage)
      this.initiateRandomIntervalConstantDamage();
  }

  initiateConstantIntervalDamage() {
    this.damageConf.cdct.forEach(damageInstance => {
      this.intervals.push(
        setInterval(() => {
          this.damageDragon(damageInstance.damage);
        }, damageInstance.interval)
      );
    });
    this.damageConf.rdct.forEach(damageInstance => {
      this.intervals.push(
        setInterval(() => {
          this.damageDragon(this.getRandomNumberBetween(damageInstance.damageMin, damageInstance.damageMax))
        }, damageInstance.interval)
      );
    });

  }

  damageDragonAfterTimeout(damage: number, intervalMin: number, intervalMax: number) {
    if (this.damageOngoing) {
      if(!this.firstConstantDamageInterval){
        this.damageDragon(damage);
        this.firstConstantDamageInterval = !this.firstConstantDamageInterval;
      }
      this.timeouts.push(
        setTimeout(() => {
          this.damageDragonAfterTimeout(damage, intervalMin, intervalMax);
        }, this.getRandomNumberBetween(intervalMin, intervalMax)));
    }
  }

  randomDamageDragonAfterTimeout(damageMin: number, damageMax: number, intervalMin: number, intervalMax: number) {
    if (this.damageOngoing) {
      if(!this.firstRandomDamageInterval){
        this.damageDragon(this.getRandomNumberBetween(damageMin, damageMax));
      }
      else{
        this.firstRandomDamageInterval = !this.firstRandomDamageInterval;
      }
     
      this.timeouts.push(setTimeout(() => {
        this.randomDamageDragonAfterTimeout(damageMin, damageMax, intervalMin, intervalMax);
      }, this.getRandomNumberBetween(intervalMin, intervalMax)));
    }
  }

  initiateRandomIntervalConstantDamage() {
    this.damageConf.cdrt.forEach(damageInstance => {
      this.damageDragonAfterTimeout(damageInstance.damage, damageInstance.intervalMin, damageInstance.intervalMax)
    });
    this.damageConf.rdrt.forEach(damageInstance => {
      this.randomDamageDragonAfterTimeout(damageInstance.damageMin, damageInstance.damageMax, damageInstance.intervalMin, damageInstance.intervalMax)
    });
  }

  beginGameClick() {
    if(this.gameRunning)
    {
      this.endGame();
    }

    this.startTime = performance.now()


    console.log("Entering beginGame()")
    this.engageStart();

    console.log("Leaving beginGame()")
  }

  endGame(){
    console.log("Entered endGame()");
    this.damageOngoing = false;
    this.gameRunning = false;
    this.intervals.forEach(interval => {
      clearInterval(interval);
    });

    this.timeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
  }



  wonGame(){
    if(this.endgameLoss || this.endgameWon)
    {
      return;
    }
    this.endgameWon = true;
    var winTime = ((this.mySmiteTime - this.smiteReactionStartTime) / 1000).toFixed(3) ;
    this.winningText = "You won by smiting the dragon in " + winTime + " seconds."

    console.log("Won");
    this.endGame();
  }

  lostGame(){
    if(this.endgameLoss || this.endgameWon)
    {
      return;
    }
    this.endgameLoss = true;
    if(this.dragonCurrentHealth > this.smiteDamage){
      this.losingText = "Whoah there buddy too fast!";
    }
    else {
      var lossTime = ((this.enemySmiteTime - this.smiteReactionStartTime) / 1000).toFixed(3) ;
      this.losingText = this.stealerName +  " stole dragon in " + lossTime + " seconds... you gota be faster!";
    }
    console.log("Lost");
    this.endGame();
  }



  endGameClick() {
    console.log("Entering endGame()")

    this.endGame();
    

    this.endTime = performance.now()
    this.timeTillDeath = this.endTime - this.startTime;
    console.log("Leaving endGame()")
    //this.beginGame();
  }

  //All damage to dragon should be done via this function
  damageDragon(damage: number, smited: Smited = Smited.byNoone) {
    switch(smited){
      //no smite, just normal damage
      case Smited.byNoone:
        if(this.dragonCurrentHealth - damage > 0){
          this.dragonCurrentHealth -= damage;
          if(this.dragonCurrentHealth <= this.smiteDamage){
            this.beginCompetition();
          }
        }
        else if(this.dragonCurrentHealth - damage <= 0){
          this.dragonCurrentHealth = 0;
          this.lostGame();
          this.endGameClick();
          return;
        }
        break;
      //Smited by player
      case Smited.byPlayer:
        if(this.dragonCurrentHealth - damage <= 0){
          this.mySmiteTime = performance.now();
          this.wonGame();
          return;
        }
        else if(this.dragonCurrentHealth - damage > 0){
          this.lostGame();
          return;
        }
        break;
      //Enemy smited
      case Smited.byEnemy:
        this.enemySmiteTime = performance.now();
        this.lostGame();
        break;
    }
  }

  beginCompetition(){
    if(!this.competitionStarted){
      this.competitionStarted = true;
      this.smiteReactionStartTime = performance.now();
      this.startEnemySmiteReaction();
    }
  }

  startEnemySmiteReaction(){
    setTimeout(() => {
      this.damageDragon(this.smiteDamage, Smited.byEnemy); //enemy smited
      this.lostGame();
    }, this.enemyReactionTime);
  }

  smiteDragonClick() {
    console.log("Button clicked");
    this.damageDragon(this.smiteDamage, Smited.byPlayer); //You smited
  }



  resetGame(){
    this.resetDragonHealth();
    this.resetCompetition();
    this.resetEndgameText();
    this.resetFirstInterval();
    this.resetTimer();
  }

  resetCompetition(){
    this.competitionStarted = false;
  }

  resetDragonHealth() {
    this.dragonCurrentHealth = this.dragonMaxHealth;
  }

  resetEndgameText(){
    this.endgameWon = false;
    this.endgameLoss = false;
  }

  resetFirstInterval(){
    this.firstConstantDamageInterval = true;
    this.firstRandomDamageInterval = true;
  }

  resetTimer(){
    this.startTimer = 3;
  }

  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
