
export default class AuthTitleScene extends Phaser.Scene {

    constructor(config) {
        super('authTitleScene');
        this.timer = false;
        this.user = config.user;
    }

    preload() {
        this.load.image('background', '/img/background.png');
        this.load.image('singleplayer', '/img/singleplayer.png');
        this.load.image('endless', '/img/endless.png');
        this.load.image('time_trial', '/img/time trial.png');
        this.load.image('how2Play', '/img/how to play.png');
        this.load.image('space', '/img/space.png');
        this.load.image('wasd', '/img/wasd.png');
        this.load.image('multiplayer', '/img/multiplayer.png')
        this.load.image('gameFont', '/img/menu_font_colors.png');
    }

    create() {
        console.log(`guestScene: ${this.user}`);

        // Set up the background
        const bg = this.add.sprite(0, 0, 'background').setOrigin(0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;

        // Add text object for username
        const usernameText = this.add.text(50, 970, '', { font: '80px Bernard', fill: '#000000' }).setName('usernameText');

        // Set up game objects
        this.add.sprite(400, 300, 'singleplayer');
        const endless_mode = this.add.sprite(400, 400, 'endless').setInteractive();
        const time_trial_mode = this.add.sprite(450, 500, 'time_trial').setInteractive();
        const multiplayer_mode = this.add.sprite(670, 700, 'multiplayer').setInteractive();
        const time_desc = this.add.text(700, 470, 'Get the highest score\n possible within 2 minutes', { font: '32px Bernard', fill: '#FFFFFF' }).setAlpha(0);
        const endless_desc = this.add.text(650, 350, 'Get the highest score\n possible with no time limit,\n as the game gets steadily faster.', { font: '32px Bernard', fill: '#FFFFFF' }).setAlpha(0);




        // Set up pointer events for game objects
        endless_mode.on('pointerover', () => {
            endless_mode.setTint("3000000");
            endless_desc.setAlpha(1);
        });


        endless_mode.on('pointerout', () => {
            endless_mode.clearTint();
            endless_desc.setAlpha(0);
        });


        endless_mode.on('pointerdown', () => this.endlessMode());




        time_trial_mode.on('pointerover', () => {
            time_trial_mode.setTint("150000000");
            time_desc.setAlpha(1);
        });
        time_trial_mode.on('pointerout', () => {
            time_trial_mode.clearTint();
            time_desc.setAlpha(0);
        });



        time_trial_mode.on('pointerdown', () => this.timeMode());




        multiplayer_mode.on('pointerover', () => {
            multiplayer_mode.setTint("550000000");
            multiplayer_mode.setScale(2);
        });
        multiplayer_mode.on('pointerout', () => {
            multiplayer_mode.clearTint();
            multiplayer_mode.setScale(1);
        });




        multiplayer_mode.on('pointerdown', () => this.multiplayer_mode());



    }

    timeMode() {
        this.scene.start('singleplayerGameScene', { timer: !this.timer , user: this.user });
    }

    endlessMode() {
        console.log('user: ' + this.user)
        this.scene.start('singleplayerGameScene', { timer: !this.timer , user: this.user});
    }

    multiplayer_mode() {

        this.scene.start('lobbyScene', { user: this.user});

    }

}

