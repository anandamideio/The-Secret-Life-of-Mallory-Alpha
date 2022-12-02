import Phaser from 'phaser';
import getRandomFloat from '../modules/getRandomFloat.js';
import range from '../modules/range.js';

/* 
player sub should have a health bar, every time the sub hits something it taakes damage, 
hitting the engines takes more damage and hitting the cockpit cannopy does damage that 
is a function of depth, collecting samples of small animals, water from new depths and 
plant & soil samples gain reputation and funding for further research

The sub should have a certain amount of battery life, O2, hit points, & sample inventory space.  These things are upgradable
the user should also be able to get a scuba suit or a Deep water diving suit that makes new more valuable samples possible to collect.  
*/

export default class Demo extends Phaser.Scene {
  playerSprite: Phaser.Physics.Arcade.Sprite | undefined = undefined;
  platforms: Phaser.Physics.Arcade.StaticGroup | undefined = undefined;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined = undefined;
  graphics: Phaser.GameObjects.Graphics | undefined = undefined;

  private ballast = 100;  //empty is -100, full is 100, and vessel is flooding when above 100
  private battery = 100;  //empty is 0, full is 100
  private life = 100;  //represents how damaged the ship has received
  private oxygen = 100;

  constructor() {
    super('GameScene');
  }

  preload() {
    // this.load.image('background', 'assets/bg_layer1.png');
    // this.load.image('logo', 'assets/Sample-Logo.png');
    // Load platforms
    this.load.image('platform-cake', 'assets/platforms/ground_cake.png');
    this.load.image('platform-grass', 'assets/platforms/ground_grass.png');
    this.load.image('platform-sand', 'assets/platforms/ground_sand.png');
    // Load the player sprite 
    this.load.spritesheet('DeepSubmergenceVehicle', 'assets/DSV-Sheet2.png', { frameWidth: 1000, frameHeight: 450 });

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  //here is where we set up the real background
  create() {
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0x00006F, 0.5);
    this.graphics.fillRect(0, 0, window.innerWidth, window.innerHeight)
    //change background color
    // var div = document.getElementById('game');
    // div.style.backgroundColor = "#F00";


    // this.add.image(920, 550, 'background').setScale(0.4);
    // const logo = this.add.image(920, 70, 'logo');

    // Create platforms
    this.platforms = this.physics.add.staticGroup();

    // Draw platforms (of different biomes) randomly
    // Starting at two because the minimum Y we want is over 190
    [...range(2, 8)].forEach((i) => {
      const x = Phaser.Math.Between(600, 1200);
      const y = 110 * i;

      // Choose a biome at random
      //NOTE: put random animals on the way down in this array
      const biome = ['cake', 'grass', 'sand'][Phaser.Math.Between(0, 2)];
      // Create a platform of that biome
      const platform = this.platforms?.create(x, y, `platform-${biome}`) as Phaser.Physics.Arcade.Sprite;
      // Give the platform a random scale
      platform.scale = 0.5 + (getRandomFloat(0, .3, 2));

      const body = platform.body as Phaser.Physics.Arcade.StaticBody;
      body.updateFromGameObject()
    });

    // Draw the player sprite
    this.playerSprite = this.physics.add.sprite(1000, 450, 'DeepSubmergenceVehicle', 0).setScale(0.5);

    // this.playerSprite.body.checkCollision.up = false;
    // this.playerSprite.body.checkCollision.left = false;
    // this.playerSprite.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.playerSprite)

    this.anims.create({
      key: 'move',
      frameRate: 7,
      // frames: this.anims.generateFrameNumbers('DeepSubmergenceVehicle', { start: 0, end: 4 }),
      frames: this.anims.generateFrameNumbers('DeepSubmergenceVehicle', { start: 0, end: 2 }),
      //here is where we need to add in bubbles animation
      repeat: -1
    });
    
    this.anims.create({
      key: 'stop',
      frameRate: 7,
      // frames: this.anims.generateFrameNumbers('DeepSubmergenceVehicle', { start: 0, end: 4 }),
      frames: this.anims.generateFrameNumbers('DeepSubmergenceVehicle', { start: 3, end: 3 }),
      //here is where we need to add in bubbles animation
      repeat: -1
    });

    // Add collision detection
    this.physics.add.collider(this.platforms, this.playerSprite);

    // this.tweens.add({
    //   targets: logo,
    //   y: 90,
    //   duration: 900,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // });
  }

  update(time: number, delta: number): void {
    const { playerSprite, cursorKeys } = this as { playerSprite: Phaser.Physics.Arcade.Sprite, cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys };
    const { up, down, left, right } = cursorKeys;

    // const keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // const keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // const keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    // const keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    const touchingGround = playerSprite.body.touching.down;

    // Jump when you touch a platform
    if (touchingGround) playerSprite.setVelocityY(0);

    // Move left and right
    // if (left.isDown && !touchingGround){
    if (left.isDown) {
      playerSprite.anims.play('move', true);
      playerSprite.setVelocityX(-200);
      playerSprite.flipX = false;
      // } else if (right.isDown && !touchingGround) {
    } else if (right.isDown) {
      playerSprite.anims.play('move', true);
      playerSprite.setVelocityX(200);
      playerSprite.flipX = true;
    } else if (up.isDown) {
      playerSprite.anims.play('stop', true);
      playerSprite.anims.stop();
      // playerSprite.anims.play('move', true);
      playerSprite.setVelocityY(-200);
    } else if (down.isDown) {
      playerSprite.anims.play('stop', true);
      playerSprite.anims.stop();
      // playerSprite.anims.play('move', true);
      playerSprite.setVelocityY(200);
    } else {
      playerSprite.setVelocityX(0);
      playerSprite.anims.play('stop', true);
      playerSprite.anims.stop();
    }
  }
}
