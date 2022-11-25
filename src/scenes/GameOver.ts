import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() { super({ key: 'game-over' }); }

  public create() {
    const { width, height } = this.scale;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    this.add.text(centerX, centerY, 'Game Over', {
      fontSize: '48px',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 48, 'Press space to restart', {
      fontSize: '24px',
      color: '#000'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('game');
    });
  }
}
