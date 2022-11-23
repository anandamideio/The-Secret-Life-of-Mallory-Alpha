import Phaser from 'phaser';
import getRandomFloat from '../modules/getRandomFloat.js';
import range from '../modules/range.js';

export default class Demo extends Phaser.Scene {
  playerSprite: Phaser.Physics.Arcade.Sprite|undefined = undefined;
  platforms: Phaser.Physics.Arcade.StaticGroup|undefined = undefined;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys|undefined = undefined;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('background', 'assets/bg_layer1.png');
    this.load.image('logo', 'assets/Sample-Logo.png');
    // Load platforms
    this.load.image('platform-cake', 'assets/platforms/ground_cake.png');
    this.load.image('platform-grass', 'assets/platforms/ground_grass.png');
    this.load.image('platform-sand', 'assets/platforms/ground_sand.png');
    // Load the player sprite
    this.load.spritesheet('mallory', 'assets/player-sheet.png', { frameWidth: 24, frameHeight: 24 });

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(920, 550, 'background').setScale(0.4);
    const logo = this.add.image(920, 70, 'logo');

    // Create platforms
    this.platforms = this.physics.add.staticGroup();

    // Draw platforms (of different biomes) randomly
    // Starting at two because the minimum Y we want is over 190
    [...range(2, 8)].forEach((i) => {
      const x = Phaser.Math.Between(600, 1200);
      const y = 110 * i;

      // Choose a biome at random
      const biome = ['cake', 'grass', 'sand'][Phaser.Math.Between(0, 2)];
      // Create a platform of that biome
      const platform = this.platforms?.create(x, y, `platform-${biome}`) as Phaser.Physics.Arcade.Sprite;
      // Give the platform a random scale
      platform.scale = 0.5 + (getRandomFloat(0, .3, 2));

      const body = platform.body as Phaser.Physics.Arcade.StaticBody;
      body.updateFromGameObject()
    });

    // Draw the player sprite
    this.playerSprite = this.physics.add.sprite(940, 320, 'mallory', 0).setScale(2);

    this.playerSprite.body.checkCollision.up = false;
    this.playerSprite.body.checkCollision.left = false;
    this.playerSprite.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.playerSprite)

    this.anims.create({
      key: 'move',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('mallory', {start: 0, end: 4}),
      repeat: -1
    });

    // Add collision detection
    this.physics.add.collider(this.platforms, this.playerSprite);

    this.tweens.add({
      targets: logo,
      y: 90,
      duration: 900,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  update(time: number, delta: number): void {
    const { playerSprite, cursorKeys } = this as { playerSprite: Phaser.Physics.Arcade.Sprite, cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys };
    const { left, right } = cursorKeys;

    const touchingDown = playerSprite.body.touching.down;

    // Jump when you touch a platform
    if (touchingDown) playerSprite.setVelocityY(-300);

    // Move left and right
    if (left.isDown && !touchingDown){
      playerSprite.anims.play('move', true);
      playerSprite.setVelocityX(-200);
    } else if (right.isDown && !touchingDown){
      playerSprite.anims.play('move', true);
      playerSprite.setVelocityX(200);
    } else {
      playerSprite.setVelocityX(0);
      playerSprite.anims.stop();
    }
  }
}
