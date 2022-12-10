export default class MainMenu extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private buttons: Phaser.GameObjects.Image[] = [];
  private selectedButtonIndex = 0;
  private buttonSelector!: Phaser.GameObjects.Image;

  constructor() { super('main-menu'); }

  init() { this.cursors = this.input.keyboard.createCursorKeys(); }

  preload() {
    const glassUIFile = 'UI/uipackSpace_sheet';
    this.load.atlasXML('glass-UI', `assets/${glassUIFile}.png`, `assets/${glassUIFile}.xml`);
    this.load.image('logo', 'assets/Sample-Logo.png');
  }

  create() {
    const { width, height } = this.scale;
    // Draw the logo at the top of the screen
    this.add.image(window.innerWidth / 2, 70, 'logo').setScale(0.75);
    // Play Main Button
    const playMainButton = this.add.image(width * 0.5, height * 0.6, 'glass-UI', 'glassPanel.png')
      .setDisplaySize(250, 50)
      .setInteractive()
      .on('selected', () => { this.scene.start('GameScene'); })
      .on('pointerover', () => { this.selectButton(0); })
      .on('pointerdown', () => { this.scene.start('GameScene'); })

    this.add.text(playMainButton.x, playMainButton.y, 'Play (Main Game)').setOrigin(0.5);

    // Play Button
    const playMatterButton = this.add.image(playMainButton.x, playMainButton.y + playMainButton.displayHeight + 10, 'glass-UI', 'glassPanel.png')
      .setDisplaySize(250, 50)
      .setInteractive()
      .on('selected', () => { this.scene.start('MatterScene'); })
      .on('pointerover', () => { this.selectButton(1); })
      .on('pointerdown', () => { this.scene.start('MatterScene'); })

    this.add.text(playMatterButton.x, playMatterButton.y, 'Play (Matter Demo)').setOrigin(0.5);

    // Options Button
    const optionsButton = this.add.image(playMatterButton.x, playMatterButton.y + playMatterButton.displayHeight + 10, 'glass-UI', 'glassPanel.png')
      .setDisplaySize(250, 50)
      .setInteractive()
      .on('selected', () => { console.log('Options'); })
      .on('pointerover', () => { this.selectButton(2); })
      .on('pointerdown', () => { console.log('Options'); })

    this.add.text(optionsButton.x, optionsButton.y, 'Options').setOrigin(0.5);

    // Add Buttons
    this.buttons.push(playMainButton, playMatterButton, optionsButton);

    // Add Cursor
    this.buttonSelector = this.add.image(0, 0, 'glass-UI', 'cursor_hand.png')

    // Select the first button
    this.selectButton(0);

    // Clear events on SHUTDOWN
    this.events.once(Phaser.Scenes.Events.SHUTDOWN as string, () => {
      playMainButton.off('selected');
      optionsButton.off('selected');
    });
  }

  selectButton(index: number){
    const currentButton = this.buttons[this.selectedButtonIndex];

    // set the current select button to a white tint
    currentButton.setTint(0xffffff);

    const button = this.buttons[index];

    // set the new selected button to a green tint
    button.setTint(0x66ff7f);

    // Move the hand cursor to the right edge
    this.buttonSelector.x = button.x + button.displayWidth * 0.5;
    this.buttonSelector.y = button.y + 10;

    // Store the new selected index
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    const nextIndex = this.selectedButtonIndex + change;

    if (nextIndex < 0) return this.selectButton(this.buttons.length - 1);
    if (nextIndex >= this.buttons.length) return this.selectButton(0);

    this.selectButton(nextIndex);
  }

  confirmSelection(){
    this.buttons[this.selectedButtonIndex].emit('selected');
  }

  update(){
    const { up, down, space } = this.cursors;
    const upJustPressed = Phaser.Input.Keyboard.JustDown(up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(down);
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(space);

    if (upJustPressed){
      this.selectNextButton(-1);
    } else if (downJustPressed){
      this.selectNextButton(1);
    } else if (spaceJustPressed){
      this.confirmSelection();
    }
  }
}
