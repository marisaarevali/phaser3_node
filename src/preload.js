
import Phaser from 'phaser';

class preloadScene extends Phaser.Scene {

  constructor() {
    super('preloadScene');
  }

  preload() {



    this.load.image('uuesti', 'assets/uuesti.png');
    this.load.image('manglabi', 'assets/manglabi.png');


    this.load.image('maapind', 'assets/maapind3.png');

    this.load.spritesheet('munaseisab', 'assets/munaseisab.png', { frameWidth: 53, frameHeight: 95 })
    this.load.spritesheet('munajookseb', 'assets/munajookseb.png', { frameWidth: 90, frameHeight: 95 })
    this.load.spritesheet('munakatki', 'assets/munakatki.png', { frameWidth: 53, frameHeight: 95 })

    this.load.image('takistus1', 'assets/takistus1.png')
    this.load.image('takistus2', 'assets/takistus2.png')
    this.load.image('takistus3', 'assets/takistus3.png')
    this.load.image('takistus4', 'assets/takistus4.png')
    this.load.image('takistus5', 'assets/takistus5.png')
  }

  create() {
    this.scene.start('gameScene');
  }
}

export default preloadScene;
