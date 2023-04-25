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
let primaryBlockIndex = [];
let secondaryBlock;
let secondaryBlockName;
let secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 1];
let nameIncrement = 0;

// Block colors
let blockColors = ["gold_block", "red_block", "blue_block", "green_block", "orange_block", "pink_block", "purple_block", "indigo_block"];
let rngSeedInt;

// Game rules
let numRows = 3;
let left, right, up, down, swap, bugR, bugE, bugQ, speedUpBtn;

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

        numRows = 14; // HOW MANY ROWS SPAWN

        main_container_blockLevel = 3;

        block_containerChildren = [];

        game_speed_display = (1).toFixed(1);

        game_speed_text = null;

        game_speed = 1000;

        checkLength = 5;

        checkStart = 0;

        timer_hours = 0;

        timer_min = this.timer ? 1 : 0;

        timer_seconds = this.timer ? 0 : 0;

        game_score_display = 0;

        score_display = null;

        game_mode_display = data.timer ? "Time Trial" : "Endless";

        block_container = null;

        main_container = null;

        lineRow = numRows;

        rngSeedInt = Math.random().toString(36).substring(2, 7);

        blue_visible_blocks = this.add.group();;
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
        // add background and border
        this.add.image(0, 0, 'white_background').setOrigin(0).setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Create instructions in corner


        */
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

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Create block container and fill it with blocks.


*/
        block_container = this.add.container((screen.width / 2) - 210, screen.height / 2 + 215, this.makeGrid(numRows, rngSeedInt).flat());

        // add containers
        main_container = this.add.container(0, 0, [block_container]);

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Create blue bordered game boundry


*/
        const grid_box = this.add.container(screen.width / 2, screen.height / 2);
        grid_box.add(this.add.image(0, 10, 'blueBorder'));
        this.add.text(710, -20, '_______________', { font: '92px Bernard', fill: '#000000' });

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Add sprites that are above bottom y level.


*/
        block_container.each(sprite => {
            if (sprite.getBounds().y < 850) {
                blue_visible_blocks.add(sprite);
                sprite.setAlpha(1);
            }
        });

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Create scoreboard to hold time, gamemode, score, and speed


*/
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

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Create keybinding for directions, swapping, speedup, and some testing buttons.


*/
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        bugQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        bugE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        bugR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        swap = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        speedUpBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Creating box cursor


*/
        boxCursor = this.add.sprite(0, 0, 'cursor');
        boxCursor.setName('BoxCursor');
        main_container.add(boxCursor);
        boxCursor.setPosition(960, 755);
        boxCursor.setScale(1.1);
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------
    }

    update(time, delta) {
        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for handling timer, getting delta time equation.


        */
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
                this.scene.start('gameoverScene', { user: this.user, game_score_display: game_score_display, game_mode_display: game_mode_display });
            }
        } else { // endless mode
            timer_seconds += fixedTime;
            if (timer_seconds.toFixed(2) == 60) {
                timer_seconds = 0;
                timer_min += 1;
            }
        }

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for updating timer text display


        */
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


        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for getting primary(left), and secondary(right) blocks' positions and the boxCursor's global x and y.

        */



        primaryBlock = block_container.getAt(this.indexForPosition(primaryBlockIndex[1], primaryBlockIndex[0]));
        secondaryBlock = block_container.getAt(this.indexForPosition((primaryBlockIndex[1] + 60), primaryBlockIndex[0]));
        boxcursorRect = boxCursor.getBounds();
        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for tracking movement left, right, up, and down. Swapping colors with space, dropping cursor if it goes above screen.


        */
        if (Phaser.Input.Keyboard.JustDown(left) && boxcursorRect.x > 726) {
            boxCursor.x -= 60;
            this.shiftFocus('left');

        } else if (Phaser.Input.Keyboard.JustDown(right) && boxcursorRect.x < 1080) {
            boxCursor.x += 60;
            this.shiftFocus('right');
        }

        if (Phaser.Input.Keyboard.JustDown(up) && boxcursorRect.y > 65) {
            boxCursor.y -= 60;
            this.shiftFocus('up');

        } else if (Phaser.Input.Keyboard.JustDown(down) && boxcursorRect.y < 790) {
            boxCursor.y += 60;
            this.shiftFocus('down');
        }

        if (Phaser.Input.Keyboard.JustDown(swap) && (primaryBlock && secondaryBlock && !primaryBlock.getData('matched') && !secondaryBlock.getData('matched'))) {
            this.swapColors(primaryBlock, secondaryBlock);
        }

        if (Phaser.Input.Keyboard.JustDown(speedUpBtn)) {
            block_containerSpeed += 0.05;
        }

        if (boxcursorRect.y < 65) {
            boxCursor.y += 60;
            this.shiftFocus('down');
        }

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for debug keys Q, R, E. Q will set primary block and secondary block to a null texture.


        */

        if (Phaser.Input.Keyboard.JustDown(bugQ)) {
            if (primaryBlock == null || secondaryBlock == null) {

            } else {
                primaryBlock.setTexture('null_block');
                primaryBlock.setData('color', 'null_block');

                secondaryBlock.setTexture('null_block');
                secondaryBlock.setData('color', 'null_block');

            }
        }

        if (Phaser.Input.Keyboard.JustDown(bugR)) {
            //
        }

        if (Phaser.Input.Keyboard.JustDown(bugE)) {
            //
        }

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for speed control, rising the container speed


        */
        block_containerRiseSpeed += (block_containerSpeed * delta);
        // what makes blocks rise:
        main_container.y = (0 - block_containerRiseSpeed);

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for ending the game after main container reaches top of grid


        */

        if (main_container.getBounds().y <= 68) {
            this.game_score_display = game_score_display
            console.log("Pre Send- " + this.game_mode_display);
            this.scene.start('gameoverScene', { user: this.user, game_score_display: game_score_display, game_mode_display: game_mode_display });
        }

        /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Section for updating block positions, deleting and creating rows, updating score text, and activating blocks.


        */
        this.activateBlocks();
        this.eliminateRow();
        this.checkForMatches(blue_visible_blocks.getChildren());
        this.eliminateRow();
        this.bubbleUpNull();
        score_display.setText(game_score_display);
        //---------------------------------------------

    }

    end() {

    }

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Methods for matching blocks and handling block 'falling', which is just null spaces rising


    */

    bubbleUpNull() {

        for (let i = 0; i < blue_visible_blocks.getChildren().length; i++) {
            let block = block_container.getAt(i);
            let block_below = block_container.getAt(this.indexForPosition(block.x, (block.y + 60)))
            if (block_below === undefined || block_below === null) {
                continue;
            }
            if (block_below.getData('color') === "null_block" && (block.getData('matched') == false && block_below.getData('matched') == false)) {
                this.swapColors(block, block_below);
            }
        }
    }

    checkForMatches(block_array) {

        const matchesSet = new Set(); // create a set of matches
        for (const block of block_array) { // for every visible block
            const { x, y } = block; // extract it's x and y
            const blockIndex = block_container.getIndex(block); // get it's index

            if (blockIndex === -1) continue;
            if (block.getData('matched') || block.getData('color') === 'null_block' || block.texture.key === 'null_block') continue;
            // stop searching if the block is invalid in the first place.
            let searchBox = [];
            let searchBoxHori = [];

            if ((block_array.length - blockIndex) >= 16) { // exclude bottom two rows
                searchBox = [ // create array of 3 vertical blocks, filter to make sure all blocks are valid
                    block_container.getAt(blockIndex),
                    block_container.getAt(this.indexForPosition(x, y + 60)),
                    block_container.getAt(this.indexForPosition(x, y + 120)),
                ].filter(b => b);
            }
            if (block.y <= 300) {
                searchBoxHori = [
                    block_container.getAt(blockIndex),
                    block_container.getAt(this.indexForPosition(x + 60, y)),
                    block_container.getAt(this.indexForPosition(x + 120, y)),
                ].filter(b => b);
            }

            const textures = searchBox.map(b => b.texture.key);
            const texturesHori = searchBoxHori.map(b => b.texture.key);
            if (textures.every(t => t === textures[0])) searchBox.forEach(block => matchesSet.add(block));
            if (texturesHori.every(t => t === texturesHori[0])) searchBoxHori.forEach(block => matchesSet.add(block));
        }

        matchesSet.forEach(block => {
            block.setData('matched', true);
            if (matchesSet.size > 0) {
                console.log(matchesSet)
            }

            block.spinToDisappear();
            game_score_display += 50;
        });

    }


    bombExplosion(bomb_block, isLeft) {
    }

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Methods for handling user actions


    */

    swapColors(block1, block2) {
        //console.log(block1, block2);
        const color1 = block1.getData('color');
        const color2 = block2.getData('color');


        if (color1 !== color2) {

            block1.setTexture(color2);
            block2.setTexture(color1);

            block1.setData('color', color2);
            block2.setData('color', color1);
        } else if (block1 == null || block2 == null) {

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



    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Methods for making the grid, creating randomness, and activating blocks below the grid


    */

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
        let blockPool = randomBlocks;// keep track of how many times the repeated color has appeared
        blockPool = this.shuffle(blockPool.slice(), rng);
        blockPool.pop();

        for (let index = 0; index < 8; index++) {
            const baseBlock = new BaseBlock(this, index * 60, increment, blockPool[index]);
            //baseBlock.setName('Block' + (nameIncrement) + "-" + index);
            baseBlock.setData({ color: blockPool[index], matched: false });
            baseBlock.setTint(0x808080);
            results.push(baseBlock);
        }

        nameIncrement += 1;
        return results;
    }

    shuffle(array, rng = Math.random) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    activateBlocks() {

        // add any new visible blue blocks to the group
        block_container.each(sprite => {
            if (sprite.getBounds().y < 850) {
                sprite.clearTint();
                blue_visible_blocks.add(sprite);
            }
        });
    }
    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Methods for deleting first row of null blocks, and adding a new one to the bottom


    */




    eliminateRow() {
        if (this.checkFirstRowEliminated()) {

            block_container.removeBetween(0, 8, true);
            this.addRow();

            block_container.iterate(function (block) {
                block.y -= 60;
            });

            block_container.y += 60;
            this.shiftFocus('up', boxCursor);
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


    addRow() {
        var row = this.makeRow((lineRow * 60));
        block_container.add(row);
        // lineRow += 1;
    }

    /*-------------------------------------------------------------------------------------------------------------------------------------------------------------


                <<Methods for getting the x and y of a block from the index number, or vice versa


    */

    indexForPosition(x, y) {
        x = x / 60;
        y = y / 60;
        //console.log('x'+x+'|y: '+ y)
        return (y * 8 + x);
    }

    positionForIndex(i) {
        return [i % 8 * 60, Math.floor(i / 8) * 60];
    }
}

export default SingleplayerGameScene;
