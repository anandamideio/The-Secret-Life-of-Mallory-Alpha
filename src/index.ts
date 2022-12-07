import Phaser from 'phaser';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver.js';
import MainMenu from './scenes/MainMenu.js';
import MatterScene from './scenes/MatterScene.js';
import UI from './scenes/UI.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#000',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.FIT,
  },
  physics: { default: 'matter', matter: { debug: true } },
  render: { pixelArt: true },
  scene: [MainMenu, Game, MatterScene, UI, GameOver]
});
