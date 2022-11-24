export default class UI extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private healthText!: Phaser.GameObjects.Text;
  private score = 0;
  private lastHealth = 100;

  constructor() {
    super({ key: 'ui' });
  }

  public init() { this.score = 0; }

  public create() {
    this.graphics = this.add.graphics();
    this.setHealthBar(100);

    this.scoreText = this.add.text(10, 40, 'Score: 0', { fontSize: '16px' });

    this.events.on('health-changed', this.handleHealthChanged, this);
  }

  private setHealthBar(value: number) {
    const width = 200
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100

    this.graphics.clear()
    this.graphics.fillStyle(0x808080)
    this.graphics.fillRoundedRect(10, 10, width, 20, 5)
    if (percent > 0) {
      this.graphics.fillStyle(0x00ff00)
      this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5)
    }
  }

  private handleHealthChanged(value: number) {
    this.tweens.addCounter({
      from: this.lastHealth,
      to: value,
      duration: 200,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: tween => {
        const value = tween.getValue()
        this.setHealthBar(value)
      }
    })

    this.lastHealth = value
  }
}
