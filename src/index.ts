import Phaser from 'phaser';
import config from './config';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver.js';
import UI from './scenes/UI.js';

new Phaser.Game(
  Object.assign(config, {
    scene: [Game, UI, GameOver]
  })
);
