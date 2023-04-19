import { BaseBlock } from './BaseBlock.js';

// Containers and text objects
let main_container;
let block_container;

let lineRow;

// Objects
let boxCursor;
let main_container_blockLevel;
let boxcursorRect;
let blue_visible_blocks;

// Block container details
let block_containerRiseSpeed = 0.015;
let block_containerSpeed = 0.015;
let block_containerChildren;

// Delays
let delay = 0;
let isRunning = true;

// Block names and indices
let primaryBlock;
let primaryBlockName;
let primaryBlockIndex = [0, 3];
let secondaryBlock;
let secondaryBlockName;
let secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 1];
let nameIncrement = 0;

// Block colors
let blockColors = ["gold_block", "red_block", "blue_block", "green_block", "orange_block", "pink_block", "purple_block", "indigo_block"];
let rngSeedInt;

// Game rules
let numRows = 6;
let left, right, up, down, swap, bugR, bugE, remove, speedUpBtn;

// Check match
let checkLength = 10;
let checkStart = 0;

// Score
let game_time_display;
var time_display;
let timer_hours;
let timer_min;
let timer_seconds;

let game_score_display;
let score_display;
let speed_display;

// Game mode and speed
let game_mode_display;
let game_speed_display;
let game_speed_text;
let game_speed;

// Timer and user
let timer;
let thisScene;
let user;

// Game Scene class definition
class SingleplayerGameScene extends Phaser.Scene {
    constructor(config) {
        super({ key: 'singleplayerGameScene' });
        this.game_score_display = game_score_display;
        this.user = user;
        this.physics = config.physics;
    }

    init(data) {
        // Set user data
        this.user = data.user || { id: 91025195823105058, name: "Guest", screenname: "Your", pfp: "default-img.jpg" };
        this.timer = data.timer;
        // Set initial values for game elements
        block_containerRiseSpeed = 0.005;
        nameIncrement = 0;
        primaryBlockIndex = [0, 180];
        secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 60];
        numRows = 14;
        main_container_blockLevel = 3;
        block_containerChildren = [];

        game_speed_display = (1).toFixed(1);
        game_speed_text = null;
        game_speed = 1000;
        checkLength = 5;
        checkStart = 0;
        timer_hours = 0;
        timer_min = this.timer ? 0 : 0;
        timer_seconds = this.timer ? 30 : 0;
        game_score_display = 0;
        score_display = null;
        game_mode_display = data.timer ? "Time Trial" : "Endless";
        block_container = null;
        main_container = null;
        lineRow = numRows;

        rngSeedInt = 'bananna';
        blue_visible_blocks;
    }


    preload() {
        this.load.image('cursor', '/img/cursor.png');
        this.load.image('white_background', '/img/white_background.png');
        this.load.image('gold_block', '/img/gold_block_lg.png');
        this.load.image('red_block', '/img/red_block_lg.png');
        this.load.image('blue_block', '/img/blue_block_lg.png');
        this.load.image('indigo_block', '/img/indigo_block_lg.png');
        this.load.image('purple_block', '/img/purple_block_lg.png');
        this.load.image('pink_block', '/img/pink_block_lg.png');
        this.load.image('green_block', '/img/green_block_lg.png');
        this.load.image('orange_block', '/img/orange_block_lg.png');
        this.load.image('testPlus', '/img/testPlus.png');
        this.load.image('blueBorder', '/img/blueborder.png');
        this.load.image('black_block', '/img/black_block_lg.png');
        this.load.image('null_block', '/img/null_block_lg.png');
        this.load.image('score_board', '/img/scoreborder.png');
        this.load.image('bomb_block', '/img/bomb_block_lg.png');

        this.load.image('how2Play', '/img/how to play.png');

        this.load.image('space', '/img/space.png');
        this.load.image('wasd', '/img/wasd.png');

        this.load.atlas('atlas', '/img/block_atlas/base_blocks.png', '/img/block_atlas/base_blocks.json');
    }

    create() {

        blue_visible_blocks = this.add.group();


        // add background and border
        const bg = this.add.image(0, 0, 'white_background').setOrigin(0).setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        // add instructions
        const how2Play = this.add.sprite(150, 100, 'how2Play').setScale(0.5).setInteractive();
        const instructionsBox = this.add.container(30, 200, [
            this.add.text(0, 0, "Controls: Use                             to move the cursor\n\n                Press:                          to swap two blocks.\n\n Make a match of 3 colors in a row to score points.\n\n If any blocks touch the top of the screen, GAME OVER.", { font: '24px Bernard', fill: '#0000000' }),
            this.add.image(225, 65, 'space').setScale(1),
            this.add.image(220, 10, 'wasd').setScale(0.8),
        ]).setAlpha(0);

        how2Play.on('pointerover', () => {
            how2Play.setTint('0x790000');
            instructionsBox.setAlpha(1);
        });

        how2Play.on('pointerout', () => {
            how2Play.clearTint();
            instructionsBox.setAlpha(0);
        });

        // add blocks
        block_container = this.add.container((screen.width / 2) - 210, screen.height / 2 + 215, this.makeGrid(numRows, rngSeedInt).flat());

        // add containers
        main_container = this.add.container(0, 0, [block_container]);

        // Add blue bordered game boundary
        const grid_box = this.add.container(screen.width / 2, screen.height / 2);
        grid_box.add(this.add.image(0, 10, 'blueBorder'));
        this.add.text(710, -20, '_______________', { font: '92px Bernard', fill: '#000000' });

        block_container.each(sprite => {
            if (sprite.y < 780) {
                blue_visible_blocks.add(sprite);
                sprite.setAlpha(1);
            }
        });

        block_container.on('childMoved', (child) => {
            if (child.y < 780) {
                console.log("blue Listened...")
                blue_visible_blocks.add(child);
                child.setAlpha(1);
            }
        });

        this.activateBlocks();



        // Scoreboard
        const score_box = this.add.container(screen.width / 1.31, screen.height / 2.55);
        score_box.add(this.add.image(0, 0, 'score_board'));

        const textConfig = { font: '32px Bernard', fill: '#000000' };
        score_box.add([
            this.add.text(-30, -300, 'Time', textConfig),
            time_display = this.add.text(-40, -250, `:: ${game_time_display} ::`, textConfig),
            this.add.text(-230, -230, '_____________________________', textConfig),
            this.add.text(-30, -150, 'Score', textConfig),
            score_display = this.add.text(-55, -100, `||     ${game_score_display}     ||`, textConfig),
            this.add.text(-230, -70, '_____________________________', textConfig),
            this.add.text(-30, 0, 'Mode', textConfig),
            this.add.text(-70, 50, `:: ${game_mode_display} ::`, textConfig),
            this.add.text(-230, 80, '_____________________________', textConfig),
            this.add.text(-30, 150, 'Speed', textConfig),
            speed_display = this.add.text(-45, 200, `[ ${game_speed_display} ]`, textConfig),
        ]);




        // Create keybindings
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        remove = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        bugE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        bugR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        swap = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        speedUpBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        // ------------------------------

        // Create Cursor
        boxCursor = this.add.sprite(0, 0, 'cursor');
        boxCursor.setName('BoxCursor');
        main_container.add(boxCursor);
        boxCursor.setPosition(960, 755);
        boxCursor.setScale(1.1);
        //------------------------------
        block_container.getAll().forEach(element => {
            element.setInteractive();
        });

    }

    update(time, delta) {
        // update text
        let deltaTime = (0.001 * delta);
        let fixedTime = deltaTime;

        if (this.timer) { // time trial mode
            if (timer_min > 0 || (timer_min == 0 && timer_seconds > 0)) {
                timer_seconds -= fixedTime;
                if (timer_seconds < 0) {
                    timer_min--;
                    timer_seconds += 60;
                }

            } else {
                this.game_score_display = game_score_display
                console.log(this.game_score_display, game_score_display + 'sdjfalk;');
                this.scene.start('gameoverScene', { user: this.user, game_score_display: game_score_display, game_mode_display: game_mode_display });
            }
        } else { // endless mode
            timer_seconds += fixedTime;
            if (timer_seconds.toFixed(2) == 60) {
                timer_seconds = 0;
                timer_min += 1;
            }
        }

        // update text display
        if (this.timer) {
            time_display.setText(timer_min + ":" + timer_seconds.toFixed(1).padStart(4, '0'));
        } else {
            time_display.setText(timer_hours + ":0" + timer_min + ":" + timer_seconds.toFixed(1));
        }

        if (Math.floor(timer_seconds) % 5 === 0 && !isRunning) {
            block_containerSpeed += 0.0005;
            console.log("5 seconds!")
            game_speed += 500;
            speed_display.setText(`[ ${game_speed / 1000} ]`);
            isRunning = true;
        } else if (Math.floor(timer_seconds) % 5 !== 0) {
            isRunning = false;
        }

        // const formattedSeconds = timer_seconds.toFixed(1).padStart(4, '0');
        // time_display.setText(`${timer_hours}:${timer_min.toString().padStart(2, '0')}:${formattedSeconds}`);

        main_container_blockLevel
        this.adjustLevel();
        // ------------

        boxcursorRect = boxCursor.getBounds();
        // check for match
        // remove
        // raise
        //cursorXYText = block_container.getByName('BoxCursor') + ": x:" + boxcursorRect.x + "| y: " + boxcursorRect.y;

        // HOVERED BLOCK INFORMATION _____________________________________________________

        primaryBlock = block_container.getAt(this.indexForPosition(primaryBlockIndex[1], primaryBlockIndex[0]));
        secondaryBlock = block_container.getAt(this.indexForPosition((primaryBlockIndex[1] + 60), primaryBlockIndex[0]));




        // _______________________________________________________________________________

        // Update and listen for directional cursor movement
        if (Phaser.Input.Keyboard.JustDown(left) && boxcursorRect.x > 726) {
            boxCursor.x -= 60;
            this.shiftFocus('left');
            //console.log("input--l");

        } else if (Phaser.Input.Keyboard.JustDown(right) && boxcursorRect.x < 1080) {
            boxCursor.x += 60;
            this.shiftFocus('right');
            //console.log("input--r");
        }

        if (Phaser.Input.Keyboard.JustDown(up) && boxcursorRect.y > 65) {
            boxCursor.y -= 60;
            this.shiftFocus('up');
            //console.log("input--u");

        } else if (Phaser.Input.Keyboard.JustDown(down) && boxcursorRect.y < 842) {
            boxCursor.y += 60;
            this.shiftFocus('down');
            //console.log("input--d");
        }

        if (boxcursorRect.y < 65) {
            boxCursor.y += 60;
            this.shiftFocus('down');
        }

        if (Phaser.Input.Keyboard.JustDown(swap)) {
            // block_container.remove(primaryBlock);

            //const color1 = primaryBlock.getData('color');
            // const color2 = secondaryBlock.getData('color');
            // if (color1 === 'bomb_block' || color2 === 'bomb_block') {
            //     if (color1 === 'bomb_block' && color2 !== 'bomb_block') {
            //         this.bombExplosion(block1);
            //     } else if (color2 === 'bomb_block' && color1 !== 'bomb_block') {
            //         this.bombExplosion(block2);
            //     } else if (color1 === 'bomb_block' && color1 === 'bomb_block'){
            //         this.bigBombExplosion();
            //     } else {

            if (primaryBlock == null || secondaryBlock == null) {

            } else {
                this.swapColors(primaryBlock, secondaryBlock);
            }
        }




        if (Phaser.Input.Keyboard.JustDown(speedUpBtn)) {
            // block_container.remove(primaryBlock);
            block_containerSpeed += 0.05;




        }

        // ________    SWAP BLOCKS _________

        if (Phaser.Input.Keyboard.JustDown(remove)) {
            if (primaryBlock == null || secondaryBlock == null) {

            } else {
                // primaryBlock.setTexture('null_block');
                // primaryBlock.setData('color', 'null_block');

                // secondaryBlock.setTexture('null_block');
                // secondaryBlock.setData('color', 'null_block');
                primaryBlock.destroy();
            }




        }

        if (Phaser.Input.Keyboard.JustDown(bugR)) {
            console.log(primaryBlock, secondaryBlock)

        }

        if (Phaser.Input.Keyboard.JustDown(bugE)) {
            console.log(primaryBlock.getData('color'), primaryBlock.getData('matched'));
        }


        //------------------------------------------------------------


        // block_container.iterate(checkVertMatch());


        // Increment focused box





        // SPEED CONTROL
        block_containerRiseSpeed += (block_containerSpeed * delta);

        main_container.y = (0 - block_containerRiseSpeed);


        if (block_container.getBounds().y <= 68) {
            this.game_score_display = game_score_display
            console.log("Pre Send- " + this.game_mode_display);
            this.scene.start('gameoverScene', { user: this.user, game_score_display: game_score_display, game_mode_display: game_mode_display });
        }




        // ----------------------------------------------------------------------------------------------------
        /*
                  ______  __    __   _______   ______  __  ___
                 /      ||  |  |  | |   ____| /      ||  |/  /
                |  ,----'|  |__|  | |  |__   |  ,----'|  '  /
                |  |     |   __   | |   __|  |  |     |    <
                |  `----.|  |  |  | |  |____ |  `----.|  .  \
                 \______||__|  |__| |_______| \______||__|\__\

                .___  ___.      ___   .___________.  ______  __    __   _______     _______.
                |   \/   |     /   \  |           | /      ||  |  |  | |   ____|   /       |
                |  \  /  |    /  ^  \ `---|  |----`|  ,----'|  |__|  | |  |__     |   (----`
                |  |\/|  |   /  /_\  \    |  |     |  |     |   __   | |   __|     \   \
                |  |  |  |  /  _____  \   |  |     |  `----.|  |  |  | |  |____.----)   |
                |__|  |__| /__/     \__\  |__|      \______||__|  |__| |_______|_______/


                */
        if ((time % 60) == 0) {

            this.eliminateRow();
            //this.matchof4Vert();
            this.matchOf3Vert();
            //this.matchof4Hori();
            //this.matchOf3Hori();
            this.activateBlocks();
            this.bubbleUpNull();
            this.eliminateRow();
            score_display.setText(game_score_display);
        }



        //---------------------------------------------

    }

    end() {

    }

    activateBlocks() {

        // add any new visible blue blocks to the group
        block_container.each(sprite => {
            if (sprite.getBounds().y < 880) {
                blue_visible_blocks.add(sprite);
                sprite.clearTint();
            }
        });
    }

    bubbleUpNull() {

        // blue_visible_blocks.getChildren().forEach(function(block){

        //     let first_x = block.x;
        //     let first_y = block.y;

        //     console.log(first_x, first_y)

        // });
        // for (let row = 0; row < numRows - 1; row++) {
        //     for (let column = 0; column < 8; column++) {

        //         let top = (8 * row) + column
        //         let bot = (8 * (row + 1)) + column

        //         let block1 = block_container.getAt(top);
        //         let block2 = block_container.getAt(bot);

        //         if (block2.getData('color') == 'null_block' && block1.getData('color') != 'null_block') {

        //             this.swapColors(block1, block2);
        //             //this.setAlphaOnBlock(block1, block2)
        //         }
        //     }
        // }
    }

    matchOf3Vert() {
        for (let row = 0; row < numRows - 2; row++) {
            for (let column = 0; column < 8; column++) {

                let top = (8 * row) + column
                let mid = (8 * (row + 1)) + column
                let bot = (8 * (row + 2)) + column

                let block1 = block_container.getAt(top);
                let block2 = block_container.getAt(mid);
                let block3 = block_container.getAt(bot);

                let color = block1.getData('color');

                if ((block1 != null && block2 != null && block3 != null) && (block1.getData('color') == color && block2.getData('color') == color && block3.getData('color') == color) && color != 'null_block' && block1.getData('matched') == false && block2.getData('matched') == false && block3.getData('matched') == false) {

                    block1.setData('matched', true);
                    block2.setData('matched', true);
                    block3.setData('matched', true);

                    block1.spinToDisappear();
                    block2.spinToDisappear();
                    block3.spinToDisappear();

                    // reward points.
                    game_score_display += 150;

                }
            }
        }
    }

    matchOf3Hori() {

        for (let row = 0; row < numRows - 1; row++) {
            for (let column = 0; column < 6; column++) {

                let start = (8 * row) + column
                let mid = (8 * row) + column + 1
                let end = (8 * row) + column + 2

                let block1 = block_container.getAt(start);
                let block2 = block_container.getAt(mid);
                let block3 = block_container.getAt(end);

                let color = block1.getData('color');

                if ((block1.getData('color') == color && block2.getData('color') == color && block3.getData('color') == color) && color != 'null_block' && block1.getData('matched') == false && block2.getData('matched') == false && block3.getData('matched') == false) {
                    // block1.setData('color', 'null_block');
                    // block2.setData('color', 'null_block');
                    // block3.setData('color', 'null_block');

                    block1.spinToDisappear();
                    block2.spinToDisappear();
                    block3.spinToDisappear();


                    // block1.setTexture('null_block');
                    // block2.setTexture('null_block');
                    // block3.setTexture('null_block');

                    //this.setAlphaOnBlock(block1, block2, block3);
                    // reward points.
                    game_score_display += 150;
                }
            }
        }
    }

    matchof4Vert() {
        for (let row = 0; row < numRows - 2; row++) {
            for (let column = 0; column < 8; column++) {

                let top = (8 * row) + column
                let mid1 = (8 * (row + 1)) + column
                let mid2 = (8 * (row + 2)) + column
                let bot = (8 * (row + 3)) + column

                let block1 = block_container.getAt(top);
                let block2 = block_container.getAt(mid1);
                let block3 = block_container.getAt(mid2);
                let block4 = block_container.getAt(bot);

                let color = block1.getData('color');

                if ((block1 != null && block2 != null && block3 != null && block4 != null) && (block1.getData('color') == color && block2.getData('color') == color && block3.getData('color') == color && block4.getData('color')) == color && color != 'null_block' && block1.getData('matched') == false && block2.getData('matched') == false && block3.getData('matched') == false && block4.getData('matched') == false) {

                    block1.spinToDisappear();
                    block2.spinToDisappear();
                    block3.spinToDisappear();
                    block4.setData('color', 'bomb_block');
                    block4.setTexture('bomb_block');

                    //this.setAlphaOnBlock(block1, block2, block3);
                    // reward points.
                    game_score_display += 300;
                }
            }
        }
    }
    matchof4Hori() {
        for (let row = 0; row < numRows - 1; row++) {
            for (let column = 0; column < 5; column++) {

                let start = (8 * row) + column
                let mid1 = (8 * row) + column + 1
                let mid2 = (8 * row) + column + 2
                let end = (8 * row) + column + 3

                let block1 = block_container.getAt(start);
                let block2 = block_container.getAt(mid1);
                let block3 = block_container.getAt(mid2);
                let block4 = block_container.getAt(end);

                let color = block1.getData('color');

                if ((block1.getData('color') == color && block2.getData('color') == color && block3.getData('color') == color && block3.getData('color') == color && block4.getData('color') == color) && color != 'null_block') {
                    block1.setData('color', 'null_block');
                    block2.setData('color', 'null_block');
                    block3.setData('color', 'null_block');
                    block4.setData('color', 'bomb_block');

                    block1.setTexture('null_block');
                    block2.setTexture('null_block');
                    block3.setTexture('null_block');
                    block4.setTexture('bomb_block');

                    //this.setAlphaOnBlock(block1, block2, block3);
                    // reward points.
                    game_score_display += 300;
                }
            }
        }
    }

    bombExplosion(bomb_block, isLeft) {
        const x = bomb_block.getData('x');
        const y = bomb_block.getData('y');
        const blocks = [];

        // Add blocks 2 directions up

        // if (y - 2 >= 0) {
        //     blocks.push(this.grid[y - 2][x]);
        // }

        // // Add blocks 2 directions down
        // if (y + 2 < this.grid.length) {
        //     blocks.push(this.grid[y + 2][x]);
        // }

        // // Add blocks 2 directions to the left
        // if (x - 2 >= 0) {
        //     blocks.push(this.grid[y][x - 2]);
        // }

        // // Add blocks 2 directions to the right
        // if (x + 2 < this.grid[0].length) {
        //     blocks.push(this.grid[y][x + 2]);
        // }

        // // Add blocks 2 diagonally up-left
        // if (y - 2 >= 0 && x - 2 >= 0) {
        //     blocks.push(this.grid[y - 2][x - 2]);
        // }

        // // Add blocks 2 diagonally up-right
        // if (y - 2 >= 0 && x + 2 < this.grid[0].length) {
        //     blocks.push(this.grid[y - 2][x + 2]);
        // }

        // // Add blocks 2 diagonally down-left
        // if (y + 2 < this.grid.length && x - 2 >= 0) {
        //     blocks.push(this.grid[y + 2][x - 2]);
        // }

        // // Add blocks 2 diagonally down-right
        // if (y + 2 < this.grid.length && x + 2 < this.grid[0].length) {
        //     blocks.push(this.grid[y + 2][x + 2]);
        // }

        //     // return blocks;    }


    }

    eliminateRow() {
        if (this.checkFirstRowEliminated()) {

            block_container.removeBetween(0, 8, true);
            this.addRow();
            //main_container.y -= 60;
        }



    }

    checkFirstRowEliminated() {
        let counter = 0;
        for (let index = 0; index < 8; index++) {

            if ((block_container.getAt(index).getData('color') == 'null_block')) {
                counter += 1;
            }
        }
        if (counter == 8) {
            console.log('8 nulls')
            return true;
        } else {
            return false;
        }

    }

    swapColors(block1, block2) {
        const color1 = block1.getData('color');
        const color2 = block2.getData('color');


        if (color1 !== color2) {
            block1.setTexture(color2);
            block2.setTexture(color1);

            block1.setData('color', color2);
            block2.setData('color', color1);
        }
    }


    shiftFocus(direction) {
        switch (direction) {
            case 'left':
                primaryBlockIndex[1] -= 60;
                break;
            case 'right':
                primaryBlockIndex[1] += 60;
                break;
            case 'up':
                primaryBlockIndex[0] -= 60;
                break;
            case 'down':
                primaryBlockIndex[0] += 60;
                break;
        }
    }

    incrementIndex() {

        if (primaryBlockIndex[1] != 7) {
            primaryBlockIndex[1] += 1;
        } else {
            primaryBlockIndex[1] = 0;
            primaryBlockIndex[0] += 1;
        }
    }

    decrementIndex() {

        if (primaryBlockIndex[1] != 0) {
            primaryBlockIndex[1] -= 1;
        } else {
            primaryBlockIndex[1] = 7;
            primaryBlockIndex[0] -= 1;
        }
    }

    shuffle(array, rng = Math.random) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    activateVisibleBlocks() {
        block_container.iterate(function (element) {
            if (element.getBounds().y > 860) {
                element.setAlpha(1);
                element.setData('activated', 'true');
            } else {
                element.setAlpha(0.5);
                element.setData('activated', 'false');
            }
        })
    }


    makeGrid(numRows, seed) {
        const gridArray = [];

        const rowSeedRng = new Math.seedrandom(seed);

        for (let index = 0; index < (numRows * 60); index += 60) {

            const rowSeed = rowSeedRng.int32();

            gridArray.push(this.makeRow(index, rowSeed));
        }
        return gridArray;
    }

    makeRow(increment, seed) {
        const results = [];

        // set random value for this match
        const rng = new Math.seedrandom(seed);

        // randomize blocks using rng
        const randomBlocks = this.shuffle(blockColors.slice(), rng);

        let repeatedColor = randomBlocks[Math.floor(rng() * 8)]; // choose the index of the color to repeat
        randomBlocks.push(repeatedColor);
        let blockPool =  randomBlocks;// keep track of how many times the repeated color has appeared
        blockPool = this.shuffle(blockPool.slice(), rng);
        blockPool.pop();

        for (let index = 0; index < 8; index++) {
            const baseBlock = new BaseBlock(this, index * 60, increment, blockPool[index]);
            baseBlock.setName('Block' + (nameIncrement) + "-" + index);
            baseBlock.setData({ color: blockPool[index], x: nameIncrement, y: index, matched: false });
            baseBlock.setTint(0x808080);
            results.push(baseBlock);
        }

        nameIncrement += 1;
        return results;
    }






    addRow() {
        var row = this.makeRow((lineRow * 60));
        block_container.add(row);
        lineRow += 1;


    }

    setAlphaOnBlock(block1, block2, block3) {

        if (block1.alpha == 0) {
            block1.setAlpha(1);
        } else {
            block1.setAlpha(0);
        }

        if (block2.alpha == 0) {
            block2.setAlpha(1);
        } else {
            block2.setAlpha(0);
        }

        if (block3.alpha == 0 && block3 != null) {
            block3.setAlpha(1);
        } else {
            block3.setAlpha(0);
        }


    }

    adjustLevel() {
        let containerHeight = main_container.getBounds().y;
        switch (containerHeight) {
            case containerHeight < 10:

                break;

            default:
                break;
        }
    }

    indexForPosition(x, y) {
        x = x/60;
        y = y/60;
        //console.log('x'+x+'|y: '+ y)
        return (y * 8 + x);
    }

    positionForIndex(i) {
        return [i % 8 * 60, Math.floor(i / 8) * 60];
    }



}

export default SingleplayerGameScene;
