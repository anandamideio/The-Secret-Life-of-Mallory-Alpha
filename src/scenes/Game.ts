import Phaser from 'phaser';
import ObstaclesController from '../entities/ObstaclesController.js';
import PlayerController from '../entities/PlayerController.js';
import getRandomFloat from '../modules/getRandomFloat.js';
import makeArrayOf from '../modules/makeArrayOf.js';
import range from '../modules/range.js';

export default class Game extends Phaser.Scene {
  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

  player?: PlayerController;
  playerSprite?: Phaser.GameObjects.Sprite;

  // platforms: Phaser.Physics.Arcade.StaticGroup|undefined = undefined;
  obstacles!: ObstaclesController;

  constructor() { super('GameScene'); }

  init(){
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.obstacles = new ObstaclesController();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN as string, () => {
      this.destroy();
    })
  }

  preload() {
    this.load.image('cityTiles', 'assets/tilemaps/tilemap.png');
    this.load.tilemapTiledJSON('levelOne', 'assets/tilemaps/CItyOne.json');

    // this.load.image('background', 'assets/bg_layer1.png');
    
    // Load platforms
    // this.load.image('platform-cake', 'assets/platforms/ground_cake.png');
    // this.load.image('platform-grass', 'assets/platforms/ground_grass.png');
    // this.load.image('platform-sand', 'assets/platforms/ground_sand.png');

    // Load objects
    // this.load.atlasXML('objects', 'assets/items/genericItems_spritesheet_colored.png', 'assets/items/genericItems_spritesheet_colored.xml');

    const spriteChoice = ['player', 'noid', 'dogBoy', 'goop', 'cleetus', 'wheelie', 'rocko', 'leo', 'pascal'][Phaser.Math.Between(0, 8)];
    // Load the player sprite
    this.load.spritesheet('mallory', `assets/players/${spriteChoice}-sheet.png`, { frameWidth: 24, frameHeight: 24 });
  }

  create() {
    // Create the UI
    this.scene.launch('ui');

    const map = this.make.tilemap({ key: 'levelOne' });
    const tileset = map.addTilesetImage('tilemap', 'cityTiles');
    const layer = map.createLayer(0, tileset, window.innerWidth / 3.33, window.innerHeight / 3.33);

    layer.setCollisionByProperty({ collides: true });

    // Draw the logo above the background
    // const logo = this.add.image(window.innerWidth / 2, 70, 'logo');
    // Create staticGroup to house the platforms
    // this.platforms = this.physics.add.staticGroup();
    // Draw platforms (of different biomes) randomly
    // Starting at two because the minimum Y we want is over 190
    // [...range(2, 8)].forEach((i) => {
    //   const x = Phaser.Math.Between(600, 1200);
    //   const y = 110 * i;

    //   // Choose a biome at random
    //   const biome = ['cake', 'grass', 'sand'][Phaser.Math.Between(0, 2)];
    //   // Create a platform of that biome
    //   const platform = this.platforms?.create(x, y, `platform-${biome}`) as Phaser.Physics.Arcade.Sprite;
    //   // Give the platform a random scale
    //   platform.scale = 0.5 + (getRandomFloat(0, .3, 2));

    //   const body = platform.body as Phaser.Physics.Arcade.StaticBody;
    //   body.updateFromGameObject()
    // });


    // [...range(48, 53)].forEach((i) => {
    //   const x = Phaser.Math.Between(600, 1200);
    //   const y = Phaser.Math.Between(0, 600);

    //   const object = this.physics.add.sprite(x, y, 'objects', `genericItem_color_0${i+1}.png`);
    //   object.setScale(.4);
    //   object.setVelocity(Phaser.Math.Between(-200, 200), 20);
    //   object.setBounce(1, 1);
    //   object.setData('type', 'object');
    //   object.setCollideWorldBounds(true);
    // });

    // Draw the player sprite
    this.playerSprite = this.add.sprite(940, 320, 'mallory', 0);

    console.log(this.playerSprite)

    // Create the player controller
    if (!this.playerSprite) throw new Error('Player sprite not found')
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
    // this.cameras.main.startFollow(this.playerSprite, true)
    // Set the horizontal deadzone to 1.5x game width
    // this.cameras.main.setDeadzone(this.scale.width * 1.5);

    // Add collision detection
    // this.physics.add.collider(this.playerSprite, layer);
    // this.physics.add.collider(this.platforms, this.playerSprite);

    // Add a collider for the logo
    // this.physics.add.collider(this.playerSprite, logo);

    // Move the logo back and forth
    // this.tweens.add({
    //   targets: logo,
    //   y: 90,
    //   duration: 900,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // });
  }

  destroy(){
    // this.scene.stop('ui');
    console.log('SHUTDOWN');
  }

  update(time: number, delta: number): void {
    this.player?.update(delta)
  }
}
