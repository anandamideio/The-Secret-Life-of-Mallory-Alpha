import Phaser from 'phaser';
import { EventCenter } from './EventCenter.js';
export default class UI extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private backText!: Phaser.GameObjects.Text;
  private techText!: Phaser.GameObjects.Text;
  private tech = 0;

  private healthText!: Phaser.GameObjects.Text;
  private lastHealth = 100;

  constructor() { super({ key: 'ui' }); }

  public init() { this.tech = 0; }

  public create() {
    this.graphics = this.add.graphics();

    this.setHealthBar(100);

    this.backText = this.add.text(10, window.innerWidth / 6, 'Back to Main Menu', { fontSize: '16px' })
      .setInteractive()
      .on('pointerdown', () => { this.scene.start('main-menu'); })
      .on('pointerover', () => { this.backText.setColor('#ff0'); })
      .on('pointerout', () => { this.backText.setColor('#fff'); });

    this.techText = this.add.text(10, 40, 'Tech: 0', { fontSize: '16px' });

    EventCenter.on('health-changed', this.handleHealthChanged, this);
    EventCenter.on('tech-collected', this.handleTechCollected, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN as string, () => {
      EventCenter.off('tech-collected', this.handleTechCollected, this);
      EventCenter.off('health-changed', this.handleHealthChanged, this);
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
