import Phaser from 'phaser';
import { sharedInstance as events } from './EventCenter.js';
export default class UI extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;

  private techText!: Phaser.GameObjects.Text;
  private tech = 0;

  private healthText!: Phaser.GameObjects.Text;
  private lastHealth = 100;

  constructor() { super({ key: 'ui' }); }

  public init() { this.tech = 0; }

  public create() {
    this.graphics = this.add.graphics();
    this.setHealthBar(100);

    this.techText = this.add.text(10, 40, 'Tech: 0', { fontSize: '16px' });

    events.on('health-changed', this.handleHealthChanged, this);
    events.on('tech-collected', this.handleTechCollected, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN as string, () => {
      events.off('tech-collected', this.handleTechCollected, this);
    });
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

  private handleTechCollected() {
    this.tech += 1;
    this.techText.setText(`Tech: ${this.tech}`);
  }
}
