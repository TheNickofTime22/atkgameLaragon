class GuestTitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'guestTitleScene' });
    }

    preload() {
        this.load.image('background', '/img/background.png');
        this.load.image('singleplayer', '/img/singleplayer.png');
        this.load.image('endless', '/img/endless.png');
        this.load.image('time_trial', '/img/time trial.png');
        this.load.image('how2Play', '/img/how to play.png');
        this.load.image('space', '/img/space.png');
        this.load.image('wasd', '/img/wasd.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;

        this.add.image(400, 300, 'singleplayer');

        const endlessMode = this.add.sprite(400, 400, 'endless').setInteractive();
        const timeTrialMode = this.add.sprite(450, 500, 'time_trial').setInteractive();

        const timeDesc = this.add.text(
            700,
            470,
            'Get the highest score\n possible within 2 minutes',
            { font: '32px Bernard', fill: '#FFFFFF' }
        ).setAlpha(0);

        const endlessDesc = this.add.text(
            650,
            350,
            'Get the highest score\n possible with no time limit,\n as the game gets steadily faster.',
            { font: '32px Bernard', fill: '#FFFFFF' }
        ).setAlpha(0);

        endlessMode.on('pointerover', function () {
            this.setTint('550000000');
            endlessDesc.setAlpha(1);
        });

        endlessMode.on('pointerout', function () {
            this.clearTint();
            endlessDesc.setAlpha(0);
        });

        timeTrialMode.on('pointerover', function () {
            this.setTint('150000000');
            timeDesc.setAlpha(1);
        });

        timeTrialMode.on('pointerout', function () {
            this.clearTint();
            timeDesc.setAlpha(0);
        });



        endlessMode.on('pointerdown', () => {
            console.log(this.timer);
            this.scene.start('singleplayerGameScene', { timer: this.timer, user: this.user});
        });

        timeTrialMode.on('pointerdown', () => {
            console.log(this.timer);
            this.scene.start('singleplayerGameScene', { timer: !this.timer, user: this.user});
        });
    }
}

export default GuestTitleScene;
