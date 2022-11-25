import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#000',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: 'matter',
    matter: { debug: true }
  },
  render: { pixelArt: true }
} as Phaser.Types.Core.GameConfig;
