
import Phaser from 'phaser';

import gameScene from './game';
import preloadScene from './preload';

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      
    }
  },
  scene: [preloadScene, gameScene]
};

new Phaser.Game(config);
