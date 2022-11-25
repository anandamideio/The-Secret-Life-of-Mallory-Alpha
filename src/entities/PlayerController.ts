import Phaser from 'phaser'
import StateMachine from '../modules/StateMachine.js';
import ObstaclesController from './ObstaclesController.js';

type PlayerConstructor = {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  obstacles: ObstaclesController;
}

export default class PlayerController {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private obstacles: ObstaclesController;

  private stateMachine: StateMachine<'idle'|'walking'|'jumping'>;
  private health = 100

  constructor({ scene, sprite, cursorKeys, obstacles }: PlayerConstructor) {
    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursorKeys;
    this.obstacles = obstacles;

    this.createAnimations();

    this.stateMachine = new StateMachine(this, 'player');

    this.stateMachine
    .addState('idle', { onEnter: this.idleOnEnter, onUpdate: this.idleOnUpdate })
    .addState('walking', { onEnter: this.walkingOnEnter, onUpdate: this.walkingOnUpdate })
    .addState('jumping', { onEnter: this.jumpingOnEnter, onUpdate: this.jumpingOnUpdate })
    .setState('walking');
  }

  private createAnimations(){
    this.sprite.anims.create({
      key: 'move',
      frameRate: 15,
      frames: this.sprite.anims.generateFrameNumbers('mallory', {start: 0, end: 4}),
      repeat: -1
    });
  }

  public update(delta: number) {
    this.stateMachine.update(delta);
  }

  private idleOnEnter() { this.sprite.anims.stop(); }

  private idleOnUpdate(){
    const { left, right, up } = this.cursors;
    if (left.isDown || right.isDown) this.stateMachine.setState('walking');

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceJustPressed || up.isDown) this.stateMachine.setState('jumping');
  }

  private walkingOnEnter() { this.sprite.anims.play('move', true); }

  private walkingOnUpdate() {
    const { left, right, up } = this.cursors;
    const speed = 200;

    if (left.isDown) {
      this.sprite.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (right.isDown) {
      this.sprite.setVelocityX(speed);
      this.sprite.setFlipX(false);
    } else {
      this.sprite.setVelocityX(0);
      this.stateMachine.setState('idle');
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceJustPressed || up.isDown) this.stateMachine.setState('jumping');
  }

  private jumpingOnEnter() { this.sprite.setVelocityY(-300); }

  private jumpingOnUpdate() {
    const { left, right } = this.cursors;
    const speed = 200;

    if (left.isDown) {
      this.sprite.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (right.isDown) {
      this.sprite.setVelocityX(speed);
      this.sprite.setFlipX(false);
    } else {
      this.sprite.setVelocityX(0);
    }

    const touchingGround = this.sprite.body.touching.down;
    if (touchingGround) this.stateMachine.setState('walking');
  }
}
