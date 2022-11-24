import Phaser from 'phaser';
import ObstaclesController from '../entities/ObstaclesController.js';
import PlayerController from '../entities/PlayerController.js';
import getRandomFloat from '../modules/getRandomFloat.js';
import range from '../modules/range.js';

export default class Game extends Phaser.Scene {
  player?: PlayerController;
  playerSprite?: Phaser.Physics.Arcade.Sprite;
  platforms: Phaser.Physics.Arcade.StaticGroup|undefined = undefined;
  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  obstacles!: ObstaclesController;

  constructor() {
    super('GameScene');
  }

  init(){
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.obstacles = new ObstaclesController();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN as string, () => {
      this.destroy();
    })
  }

  preload() {
    this.load.image('background', 'assets/bg_layer1.png');
    this.load.image('logo', 'assets/Sample-Logo.png');
    // Load platforms
    this.load.image('platform-cake', 'assets/platforms/ground_cake.png');
    this.load.image('platform-grass', 'assets/platforms/ground_grass.png');
    this.load.image('platform-sand', 'assets/platforms/ground_sand.png');

    const spriteChoice = ['player', 'noid', 'dogBoy', 'goop', 'cleetus', 'wheelie', 'rocko'][Phaser.Math.Between(0, 6)];
    // Load the player sprite
    this.load.spritesheet('mallory', `assets/players/${spriteChoice}-sheet.png`, { frameWidth: 24, frameHeight: 24 });
  }

  create() {
    // Draw the background
    this.add.image(920, 550, 'background').setScale(0.4);
    // Draw the logo above the background
    const logo = this.add.image(920, 70, 'logo');
    // Create staticGroup to house the platforms
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

    // Create the player controller
    this.player = new PlayerController({
      scene: this,
      sprite: this.playerSprite,
      cursorKeys: this.cursorKeys,
      obstacles: this.obstacles
    });

    // Don't collide unless your landing on something
    // this.playerSprite.body.checkCollision.up = false;
    // this.playerSprite.body.checkCollision.left = false;
    // this.playerSprite.body.checkCollision.right = false;
    // Follow the player
    this.cameras.main.startFollow(this.playerSprite, true)
    // Set the horizontal deadzone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    // Add collision detection
    this.physics.add.collider(this.platforms, this.playerSprite);

    // Add a collider for the logo
    this.physics.add.collider(this.playerSprite, logo);

    // Move the logo back and forth
    this.tweens.add({
      targets: logo,
      y: 90,
      duration: 900,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  destroy(){
    // this.scene.stop('ui');
    console.log('SHUTDOWN');
  }

  update(time: number, delta: number): void {
    this.player?.update(delta)
  }
}
