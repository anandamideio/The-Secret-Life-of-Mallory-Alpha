export default class MatterScene extends Phaser.Scene {
  car!: Phaser.Physics.Matter.Image;
  tracker1!: Phaser.GameObjects.Rectangle;
  tracker2!: Phaser.GameObjects.Rectangle;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  vector!: MatterJS.VectorFactory;

  constructor() { super('MatterScene'); }

  preload() {
    this.load.image('car', 'assets/car.png');
    this.load.image('track', 'assets/track.png');
  }

  create() {
    // Create the UI
    this.scene.launch('ui');

    this.vector = this.matter.vector;

    this.add.tileSprite(400, 300, 800, 600, 'soil');

    this.car = this.matter.add.image(400, 300, 'car');
    this.car.setAngle(-90);
    this.car.setFrictionAir(0.2);
    this.car.setMass(10);

    this.matter.world.setBounds(0, 0, 800, 600);

    this.tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    this.tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.matter.world.disableGravity();
  }

  update() {
    const { car, cursors, tracker1, tracker2, vector } = this;
    const { up, down } = cursors;
    const point1 = car.getTopRight();
    const point2 = car.getBottomRight();

    tracker1.setPosition(point1.x, point1.y);
    tracker2.setPosition(point2.x, point2.y);
    
    const speed = 0.03;
    const angle = vector.angle(point1, point2);
    const force = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed}

    if (up.isDown) {
      car.thrust(0.05);
      this.steer(vector.neg(force));
    } else if (down.isDown) {
      car.thrustBack(0.05);
      this.steer(force);
    }
  }

  steer(force: MatterJS.Vector){
    const { cursors: { left, right }, car, vector } = this;

    if (left.isDown) {
      this.matter.body.applyForce(car.body as MatterJS.BodyType, car.getTopRight(), force);
    } else if (right.isDown) {
      this.matter.body.applyForce(car.body as MatterJS.BodyType, car.getBottomRight(), vector.neg(force));
    }
  }

  destroy(){
    this.scene.stop('ui');
    console.log('SHUTDOWN');
  }
}
