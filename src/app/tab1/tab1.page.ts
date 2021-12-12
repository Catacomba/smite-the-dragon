import { Component } from '@angular/core';
import { DamageConfiguration } from "f:/_git-repos/Smite me/smite-the-dragon/src/app/tab1/DamageConfiguration"

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
  constructor() {

  }

  engageStart(){
    this.gameRunning = true;
    this.startTimer = 3;
    this.resetDragonHealth();
    var i = setInterval(() => {
      if(this.startTimer <= 1){
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
    this.resetFirstInterval();
  }

  resetFirstInterval(){
    this.firstConstantDamageInterval = true;
    this.firstRandomDamageInterval = true;
  }

  wonGame(){
    console.log("Won");
    this.endGame();
  }

  lostGame(){
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
  damageDragon(damage: number, smited: boolean = false) {
    if(smited){
      if(this.dragonCurrentHealth - damage <= 0){
        this.wonGame();
      }
      else if(this.dragonCurrentHealth - damage > 0){
        this.lostGame();
      }
    }
    else{
      if(this.dragonCurrentHealth - damage > 0){
        this.dragonCurrentHealth -= damage;
      }
      else if(this.dragonCurrentHealth - damage <= 0){
        this.dragonCurrentHealth = 0;
        this.lostGame();
        this.endGameClick();
      }
    }
  }

  smiteDragonClick() {
    console.log("Button clicked");
    this.damageDragon(this.smiteDamage, true);
  }

  resetDragonHealth() {
    this.dragonCurrentHealth = this.dragonMaxHealth;
  }


  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
