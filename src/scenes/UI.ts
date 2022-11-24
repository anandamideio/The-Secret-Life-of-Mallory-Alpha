export default class UI extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private healthText!: Phaser.GameObjects.Text;
  private score = 0;
  private health = 100;

  constructor() {
    super({ key: 'ui' });
  }

  init(){ this.score = 0; }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0x000000, 0.5);
    this.graphics.fillRect(0, 0, 400, 50);

    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#fff' });
    this.healthText = this.add.text(10, 30, 'Health: 100', { fontSize: '16px', fill: '#fff' });
  }
}
