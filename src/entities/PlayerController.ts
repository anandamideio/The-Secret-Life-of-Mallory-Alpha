import Phaser from 'phaser';
import StateMachine from '../modules/StateMachine.js';
import ObstaclesController from './ObstaclesController.js';

interface PlayerConstructor {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  obstacles: ObstaclesController;
  options?: PlayerSceneOptions;
}

interface PlayerSceneOptions {
  label?: string;
  speed?: { x: number, y: number };
  health?: {
    max?: number,
    current?: number,
    additional?: number,
    onChange?: (health: number) => void
  };
  radius?: number;
  friction?: number;
  frictionAir?: number;
  restitution?: number;
  origin?: { x: number, y: number };
}

const defaults = {
  label: 'Player',
  speed: { x: 3, y: 2 },
  health: { max: 100, current: 100, additional: 0,  },
  radius: 12,
  friction: 0.3,
  frictionAir: 0.05,
  restitution: 0.5,
  origin: { x: 0.5, y: 0.5 }
}

export default class PlayerController {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite|Phaser.Physics.Matter.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private obstacles: ObstaclesController;
  private options: Required<PlayerSceneOptions>;
  private body: MatterJS.BodyType;
  private stateMachine: StateMachine<'idle'|'walking'|'jumping'>;
  private health = 100
  private speed = { x: 3, y: 2};

  constructor({ scene, sprite, cursorKeys, obstacles, options }: PlayerConstructor) {
    this.options = { ...defaults, ...options };
    this.speed = this.options.speed;

    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursorKeys;
    this.obstacles = obstacles;
    
    this.createAnimations();

    this.body = this.scene.matter.bodies.circle(this.sprite.x, this.sprite.y, this.options.radius, {
      label: this.options.label,
      frictionAir: this.options.frictionAir,
      friction: this.options.friction,
      restitution: this.options.restitution
    });

    this.sprite.setOrigin(this.options.origin.x, this.options.origin.y);

    this.scene.matter.add.gameObject(this.sprite, this.body);

    this.stateMachine = new StateMachine(this, this.options.label);

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
    const { left, right, up, space } = this.cursors;
    const xSpeed = this.speed.x;
    const { matter } = this.scene;

    if (left.isDown) {
      matter.body.setVelocity(this.body, { x: -xSpeed, y: this.body.velocity.y })
      this.sprite.setFlipX(true);
    } else if (right.isDown) {
      matter.body.setVelocity(this.body, { x: xSpeed, y: this.body.velocity.y })
      this.sprite.setFlipX(false);
    } else {
      matter.body.setVelocity(this.body, { x: 0, y: this.body.velocity.y })
      this.stateMachine.setState('idle');
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(space)
    if (spaceJustPressed || up.isDown) this.stateMachine.setState('jumping');
  }

  private jumpingOnEnter() {
    const { matter } = this.scene;
    const ySpeed = this.speed.y;
    matter.body.setVelocity(this.body, { x: this.body.velocity.x, y: -ySpeed });
   }

  private jumpingOnUpdate() {
    const { left, right } = this.cursors;
    const xSpeed = this.speed.x;
    const { matter } = this.scene;

    if (left.isDown) {
      matter.body.setVelocity(this.body, { x: -xSpeed, y: this.body.velocity.y })
      this.sprite.setFlipX(true);
    } else if (right.isDown) {
      matter.body.setVelocity(this.body, { x: xSpeed, y: this.body.velocity.y });
      this.sprite.setFlipX(false);
    } else {
      matter.body.setVelocity(this.body, { x: 0, y: this.body.velocity.y });
    }

    // if (this.sprite.body.touching.down) this.stateMachine.setState('walking');
  }

  public changeHealth(health: number) {
    this.health += health;

    if (this.options.health.onChange && typeof this.options.health.onChange === 'function') {
      this.options.health.onChange(this.health);
    }
  }

  destroy() {
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.removeInteractive();
    this.scene.matter.world.remove(this.body);
    this.sprite.destroy();
    this.stateMachine.destroy();
  }
}
