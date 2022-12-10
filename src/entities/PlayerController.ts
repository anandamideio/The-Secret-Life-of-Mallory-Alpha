import Phaser from 'phaser';
import StateMachine from '../modules/StateMachine.js';
import ObstaclesController from './ObstaclesController.js';

type PlayerConstructor = {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  obstacles: ObstaclesController;
}

export default class PlayerController {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite|Phaser.Physics.Matter.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private obstacles: ObstaclesController;

  private body: MatterJS.BodyType;
  private stateMachine: StateMachine<'idle'|'walking'|'jumping'>;
  private health = 100
  private speed = { x: 3, y: 2};

  constructor({ scene, sprite, cursorKeys, obstacles }: PlayerConstructor) {
    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursorKeys;
    this.obstacles = obstacles;

    this.createAnimations();

    this.body = this.scene.matter.bodies.circle(this.sprite.x, this.sprite.y, 12, {
      label: 'player',
      frictionAir: 0.05,
      friction: 0.1,
      restitution: 0.5
    });

    this.sprite.setOrigin(0.5, 0.5);

    this.scene.matter.add.gameObject(this.sprite, this.body);

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
    const xSpeed = this.speed.x;

    if (left.isDown) {
      this.scene.matter.body.setVelocity(this.body, { x: -xSpeed, y: this.body.velocity.y })
      this.sprite.setFlipX(true);
    } else if (right.isDown) {
      this.scene.matter.body.setVelocity(this.body, { x: xSpeed, y: this.body.velocity.y })
      this.sprite.setFlipX(false);
    } else {
      this.scene.matter.body.setVelocity(this.body, { x: 0, y: this.body.velocity.y })
      this.stateMachine.setState('idle');
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
    if (spaceJustPressed || up.isDown) this.stateMachine.setState('jumping');
  }

  private jumpingOnEnter() {
    const ySpeed = this.speed.y;
     // set the vertical velocity of the body to -300
     this.scene.matter.body.setVelocity(this.body, { x: this.body.velocity.x, y: -ySpeed });
   }

  private jumpingOnUpdate() {
    const { left, right } = this.cursors;
    const xSpeed = this.speed.x;

    if (left.isDown) {
      this.scene.matter.body.setVelocity(this.body, { x: -xSpeed, y: this.body.velocity.y })
      this.sprite.setFlipX(true);
    } else if (right.isDown) {
      this.scene.matter.body.setVelocity(this.body, { x: xSpeed, y: this.body.velocity.y });
      this.sprite.setFlipX(false);
    } else {
      this.scene.matter.body.setVelocity(this.body, { x: 0, y: this.body.velocity.y });
    }

    // if (this.sprite.body.touching.down) this.stateMachine.setState('walking');
  }
}
