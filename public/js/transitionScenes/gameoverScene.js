class GameoverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameoverScene' });
        this.user;
    }

    preload() {
        this.load.image('background', '/resources/img/background.png');
    }

    init(data) {
        console.log(data);
        this.game_score_display = data.game_score_display;
        this.game_mode_display = data.game_mode_display;
        this.user = data.user;
        this.isWinner = data.win;
        if (this.user.id == 91025195823105058 ){
            this.isUserLoggedIn = false;
        } else {
            this.isUserLoggedIn = true;
        }


    }

    create() {


        var bg = this.add.sprite(0, 0, 'background').setTint('3200000000');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;

        // call renderGameoverScreen method with appropriate parameter
        this.renderGameoverScreen(this.isUserLoggedIn);

        var play_again = this.add.text(110, 650, 'to play again\n  Click Here', { font: '100px Bernard', fill: '#FFFFFF' }).setInteractive();
        play_again.on('pointerdown', () => this.clickButton());
    }

    renderGameoverScreen(isUserLoggedIn) {
        this.add.text(this.width, 150, 'Game Over', { font: '132px Bernard', fill: '#FFFFFF' });

        if (isUserLoggedIn) {
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/scores');
            xhr.setRequestHeader('X-CSRF-TOKEN', token);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log('Score saved successfully!');


                } else {
                    console.error('Error saving score:', xhr.statusText);
                }
            };
            xhr.onerror = () => {
                console.error('Error saving score:', xhr.statusText);
            };
            xhr.send(JSON.stringify({
                user_id: this.user.id, // Replace with the user ID of the logged-in user
                GameMode: this.game_mode_display, // Replace with the game mode of the current game
                score: this.game_score_display, // Replace with the score of the current game
            }));



            // if user is logged in, display different text and options
            console.log(this.isWinner);
            if (this.isWinner == undefined){
                var winnerText = this.add.text(1000, 450, "Guest Score: " + this.game_score_display, { font: '132px Bernard', fill: '#FFFFFF' }).setOrigin(0.5);
            } else if (!this.isWinner){
                var winnerText = this.add.text(1000, 450, " You Won! ", { font: '132px Bernard', fill: '#FFFFFF' }).setOrigin(0.5);
            } else if (this.isWinner) {
                var winnerText = this.add.text(1000, 450, " You Lose! ", { font: '132px Bernard', fill: '#FFFFFF' }).setOrigin(0.5);
            }

            // this.add.text(700, 150, this.game_mode_display, { font: '132px Bernard', fill: '#FFFFFF' });
            console.log(this.game_mode_display);
            this.tweens.add({
                targets: winnerText,
                y: winnerText.y + 50,
                ease: 'Sine.easeInOut',
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
            this.tweens.add({
                targets: winnerText,
                angle: 10,
                ease: 'Sine.easeInOut',
                duration: 500,
                yoyo: true,
                repeat: -1
            });

            this.add.text(1400, 860, "Click here to view leaderboard", { font: '60px Bernard', fill: '#FFFFFF' }).setOrigin(0.5).setInteractive();



            // USER IS NOT LOGGED IN:::::::
        } else {
            // if user is not logged in, display default text and options
            var scoreText = this.add.text(1000, 450, "Score: " + this.game_score_display, { font: '132px Bernard', fill: '#FFFFFF' }).setOrigin(0.5);
            this.tweens.add({
                targets: scoreText,
                y: scoreText.y + 50,
                ease: 'Sine.easeInOut',
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
            this.tweens.add({
                targets: scoreText,
                angle: 10,
                ease: 'Sine.easeInOut',
                duration: 500,
                yoyo: true,
                repeat: -1
            });

            this.add.text(1400, 860, "Login or Sign Up to record your scores!", { font: '60px Bernard', fill: '#FFFFFF' }).setOrigin(0.5);
        }
    }

    clickButton() {
        this.scene.start('gameScene');
    }
}

export default GameoverScene;
