import { BaseBlock } from './BaseBlock.js';


// var block_container;
// var red_block_container;

// var main_container;
// var red_main_container;

// var debugText;
// var cursorXYText;
// var lineRow;
// var red_lineRow;

// // object details
// var boxCursor;
// var boxCursor2
// var boxcursorRect;
// var block_acceleration = 0.115;
// var block_containerSpeed = 0.015;
// var rowIncrement = 0;
// var primaryBlock;
// var secondaryBlock;
// var primaryBlockIndex = [0, 3];
// var secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 1];
// // ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
// var primaryBlock_2p;
// var secondaryBlock_2p;
// var primaryBlockIndex_2p = [0, 3];
// var blockColors = ["gold_block", "red_block", "blue_block", "green_block", "orange_block", "pink_block", "purple_block", "indigo_block"];

// // Game rules
// var numRows;
// var left, right, up, down, swap, bugR, bugE, remove, speedUpBtn;

// // check match
// var checkLength = 10;

// // score
// var game_time_display, time_display; // keeps track of game time
// var timer_hours, timer_min, timer_seconds;
// var game_score_display, score_display, speed_display; // current score from matches
// var game_mode_display; // current gamemode
// var game_speed_display; // current game speed
// var game_speed_text;
// var game_speed = 1.00;
// var timer;

// let rngSeedSource;
// let red_RNG;
// let blue_RNG;
// let blue_visible_blocks;
// let red_visible_blocks;
// let columnArray;



// Block containers
var block_container;
var red_block_container;

// Main containers
var main_container;
var red_main_container;

// Debugging text
var lineRow;
var red_lineRow;

// Object details
var boxCursor;
var boxCursor2;
var boxcursorRect;
var block_acceleration = 0.115;
var block_containerSpeed = 0.015;
var rowIncrement = 0;

// Primary and secondary blocks
var primaryBlock;
var secondaryBlock;
var primaryBlockIndex = [0, 180];
var secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 60];
var primaryBlock_2p;
var secondaryBlock_2p;
var primaryBlockIndex_2p = [0, 180];


// Block colors
var blockColors = ["gold_block", "red_block", "blue_block", "green_block", "orange_block", "pink_block", "purple_block", "indigo_block"];

// Game rules
var numRows;
var left, right, up, down, swap, bugR, bugE, bugQ, speedUpBtn;

// Check match
var checkLength = 10;

// Score
// var game_time_display;
// var time_display; // Keeps track of game time
// var timer_hours;
// var timer_min;
// var timer_seconds;
// var game_score_display;
// var score_display;
// var speed_display; // Current score from matches
// var game_mode_display; // Current gamemode
// var game_speed_display; // Current game speed
// var game_speed_text;
var game_speed = 1.00;
//var timer;

// RNG and visible blocks
let rngSeedSource;
let red_RNG;
let blue_RNG;
let blue_visible_blocks;
let red_visible_blocks;

// Column array
let columnArray;
class MultiplayerGameScene extends Phaser.Scene {



    constructor(config) {
        super({ key: 'multiplayerGameScene' });

        this.user = config.user;
        console.log('constructor has run')

    }

    init(data) {
        this.ably = data.ably;
        this.user = data.user;
        this.rngSeed = data.rngSeed;
        this.currentMatch = this.ably.channels.get(data.channelName);

        // Debugging
        console.log('currentMatch is made with channelname');

        // Block and row details
        block_acceleration = 0.000005;
        rowIncrement = 0;
        primaryBlockIndex = [0, 180];
        secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 60];
        numRows = 14;

        // Game speed
        //game_speed_display;
        //game_speed_text; // Current game speed
        game_speed = 1.00;

        // Match checking
        checkLength = 5;

        // Game mode
        // timer_hours = 0;
        // timer_min = 0;
        // timer_seconds = 0;
        //game_score_display = 0;
        //score_display; // Current score from matches

        // if (timer) {
        //     game_mode_display = "Time Trial"; // Current gamemode
        // } else {
        //     game_mode_display = "Endless"; // Current gamemode
        // }

        //game_speed_display = "<< " + game_speed.toFixed(2) + " >>"; // Current game speed

        // Containers
        block_container;
        main_container;
        red_block_container;
        red_main_container;

        // Row details
        lineRow = numRows;
        red_lineRow = numRows;

        // RNG and visible blocks
        self = this;
        rngSeedSource = this.rngSeed;
        red_RNG = new Math.seedrandom(rngSeedSource);
        blue_RNG = new Math.seedrandom(rngSeedSource);
        blue_visible_blocks = this.add.group();
        red_visible_blocks = this.add.group();
        columnArray = {};
    };

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
        this.load.image('redBorder', '/img/redborder.png');
        this.load.image('black_block', '/img/black_block_lg.png');
        this.load.image('null_block', '/img/null_block_lg.png');
        this.load.image('score_board', '/img/scoreborder.png');
        this.load.image('bomb_block', '/img/bomb_block_lg.png');

        this.load.image('cursor2', '/img/cursor2.png');

        this.load.atlas('atlas', '/img/block_atlas/base_blocks.png', '/img/block_atlas/base_blocks.json');
    }



    create() {
        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Create currentMatch listener event, listening for keypresses.


*/
        this.currentMatch.subscribe('player-keypress', (message) => {
            console.log('------player-keypress heard something-------')
            if (message.data.user.id != this.user.id) {
                switch (message.data.key) {
                    case 'left':
                        console.log('leftPress;')
                        this.shiftFocus('left', boxCursor2)
                        break;
                    case 'right':
                        this.shiftFocus('right', boxCursor2)
                        break;
                    case 'up':
                        this.shiftFocus('up', boxCursor2)
                        break;
                    case 'down':
                        this.shiftFocus('down', boxCursor2)
                        break;
                    case 'space':
                        this.swapColors(primaryBlock_2p, secondaryBlock_2p)
                        break;
                    case 'shift':
                        //this.speedUp();
                        break;
                    default:
                        break;
                }
            }
        });
        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Created background


*/
        // add background and border
        var bg = this.add.image(0, 0, 'white_background');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;
        /*------------------------------------------------------------------------------------------------------------------------------------------


                            <<Created BLUE block container and main container, populated with grid and blue_rng call.


        */
        block_container = this.add.container((screen.width / 4) - 210, screen.height / 2 + 215, this.makeGrid(numRows, blue_RNG).flat());
        main_container = this.add.container(0, 0);
        main_container.add(block_container);


        // Add blue bordered game boundry
        var grid_box = this.add.container(screen.width / 4, (screen.height / 2))
        grid_box.add([this.add.image(0, 10, "blueBorder")]);
        this.add.text(230, -20, "___________", { font: '92px Bernard', fill: '#000000' });

        block_container.each(sprite => {
            if (sprite.y < 780) {
                blue_visible_blocks.add(sprite);
                sprite.setAlpha(1);
            }
        });
        /*------------------------------------------------------------------------------------------------------------------------------------------


                            <<Created RED block container and main container, populated with grid and blue_rng call.


        */
        red_block_container = this.add.container((screen.width / 1.5) + 111, screen.height / 2 + 215, this.makeGrid(numRows, red_RNG, false).flat());
        red_main_container = this.add.container(0, 0);
        red_main_container.add(red_block_container);

        var red_grid_box = this.add.container(screen.width / 1.2, (screen.height / 2))
        red_grid_box.add([this.add.image(0, 10, "redBorder")]);
        this.add.text(1350, -20, "___________", { font: '92px Bernard', fill: '#000000' });

        red_block_container.each(sprite => {
            if (sprite.y < 780) {
                red_visible_blocks.add(sprite);
                sprite.setAlpha(1);
            }
        });

        /*------------------------------------------------------------------------------------------------------------------------------------------
                            <<Create Scoreboard, MUST CHANGE LATER, NO SCORE IS BEING KEPT

        */
        // var score_box = this.add.container(screen.width / 1.97, (screen.height / 2.55));
        // score_box.add([this.add.image(0, 0, "score_board")]);

        // score_box.add(this.add.text(-30, -300, 'Time', { font: '32px Bernard', fill: '#000000' }));
        // score_box.add(time_display = this.add.text(-40, -250, ':: ' + game_time_display + ' ::', { font: '32px Bernard', fill: '#000000' }));

        // score_box.add(this.add.text(-230, -230, "_____________________________", { font: '32px Bernard', fill: '#000000' }));

        // score_box.add(this.add.text(-30, -150, 'Score', { font: '32px Bernard', fill: '#000000' }));
        // score_box.add(score_display = this.add.text(-55, -100, '||     ' + game_score_display + '     ||', { font: '32px Bernard', fill: '#000000' }));

        // score_box.add(this.add.text(-230, -70, "_____________________________", { font: '32px Bernard', fill: '#000000' }));

        // score_box.add(this.add.text(-30, 0, 'Mode', { font: '32px Bernard', fill: '#000000' }));
        // score_box.add(this.add.text(-70, 50, ':: ' + game_mode_display + ' ::', { font: '32px Bernard', fill: '#000000' }));

        // score_box.add(this.add.text(-230, 80, "_____________________________", { font: '32px Bernard', fill: '#000000' }));

        // score_box.add(this.add.text(-30, 150, 'Speed', { font: '32px Bernard', fill: '#000000' }));
        // score_box.add(speed_display = this.add.text(-60, 200, game_speed_display, { font: '32px Bernard', fill: '#000000' }));

        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Created keybindings for directional input, as well as 3 debug buttons


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
        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Created both cursor objects


*/
        // Create Cursor
        boxCursor = this.add.sprite(0, 0, 'cursor');
        boxCursor.setName('BoxCursor');
        main_container.add(boxCursor);
        boxCursor.setPosition(480, 755);
        boxCursor.setScale(1.1);
        //------------------------------

        // Create Cursor2
        boxCursor2 = this.add.sprite(0, 0, 'cursor2');
        boxCursor2.setName('BoxCursor2');
        red_main_container.add(boxCursor2);
        boxCursor2.setPosition(1600, 755);
        boxCursor2.setScale(1.1);
        //-----------------------------------------------------------------------------------------------------------------------------------------
    }

    update(time, delta) {
        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Update timer to keep time, MIGHT REMOVE


*/
        // let deltaTime = (0.001 * delta);
        // let fixedTime = deltaTime;
        // timer_seconds += (fixedTime);

        // if (timer_seconds.toFixed(2) == 60) {
        //     timer_seconds = 0;
        //     timer_min += 1;

        //     if (timer_min.toFixed(2) == 60) {
        //         timer_seconds = 0;
        //         timer_min = 0;
        //         timer_hours += 1;
        //     }
        // } else if (timer_seconds.toFixed(2) % 5 == 0) {
        //     block_containerSpeed += 0.001;

        //     game_speed += 0.0001
        //     speed_display.setText("<< " + game_speed + " >>");
        // }
        // time_display.setText(timer_hours + ":0" + timer_min + ":" + timer_seconds.toFixed(1));


        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Update Your cursor position, and the tracking for cursor2. get blocks that both cursors hover over.


*/
        boxcursorRect = boxCursor.getBounds();

        primaryBlock = block_container.getAt(this.indexForPosition(primaryBlockIndex[1], primaryBlockIndex[0]));

        secondaryBlock = block_container.getAt(this.indexForPosition((primaryBlockIndex[1] + 60), primaryBlockIndex[0]));



        primaryBlock_2p = red_block_container.getAt(this.indexForPosition(primaryBlockIndex_2p[1], primaryBlockIndex_2p[0]));

        secondaryBlock_2p = red_block_container.getAt(this.indexForPosition((primaryBlockIndex_2p[1] + 60), primaryBlockIndex_2p[0]));


        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Update cursor based on directional input


*/
        if (Phaser.Input.Keyboard.JustDown(left) && boxcursorRect.x > 248) {
            this.shiftFocus('left', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'left' });

        } else if (Phaser.Input.Keyboard.JustDown(right) && boxcursorRect.x < 600) {
            this.shiftFocus('right', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'right' });
        }

        if (Phaser.Input.Keyboard.JustDown(up) && boxcursorRect.y > 65) {
            this.shiftFocus('up', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'up' });

        } else if (Phaser.Input.Keyboard.JustDown(down) && boxcursorRect.y < 842) {
            this.shiftFocus('down', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'down' });
        }

        if (Phaser.Input.Keyboard.JustDown(swap) && (primaryBlock && secondaryBlock && !primaryBlock.getData('matched') && !secondaryBlock.getData('matched'))) {

            console.log('pressed space')
            this.swapColors(primaryBlock, secondaryBlock);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'space', primary: primaryBlock_2p, secondary: secondaryBlock_2p });


        }

        if (Phaser.Input.Keyboard.JustDown(speedUpBtn)) {
            //
        }

        if (boxcursorRect.y < 65) {
            boxCursor.y += 60;
            this.shiftFocus('down', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'down' });
        }

/*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Debug input. Debug Q will set hovered blocks' textures to null


*/

        if (Phaser.Input.Keyboard.JustDown(bugQ)) {
            if (primaryBlock == undefined || secondaryBlock == undefined) {
                console.log('working:')
                for (let index = 0; index < 8; index++) {
                    red_block_container.getAt(index).setData('color', 'null_block');
                    red_block_container.getAt(index).setTexture('null_block');
                }

            } else {
                primaryBlock.setTexture('null_block');
                primaryBlock.setData('color', 'null_block');

                secondaryBlock.setTexture('null_block');
                secondaryBlock.setData('color', 'null_block');
            }
        }

        if (Phaser.Input.Keyboard.JustDown(bugR)) {
            console.log(red_RNG())
            console.log(blue_RNG())

        }

        if (Phaser.Input.Keyboard.JustDown(bugE)) {
            console.log(block_container.getAt(0).getData('x'), block_container.getAt(0).getData('y'), block_container.getAt(0).getData('color'));
        }


        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Speed control, determining rising of containers.


*/
        block_acceleration += (block_containerSpeed * delta);

        main_container.y = (0 - block_acceleration);
        red_main_container.y = (0 - block_acceleration);


        if (block_container.getBounds().y <= 68) {

            this.scene.start('gameoverScene', { win: true, user: this.user });
        }

        if (red_block_container.getBounds().y <= 68) {
            this.scene.start('gameoverScene', { win: false, user: this.user });
        }
/*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Methods for your grid management.


*/
        this.eliminateRow();
        this.activateBlocks();
        this.updateGrid(blue_visible_blocks, block_container);
        this.updateGrid(red_visible_blocks, red_block_container);
        //score_display.setText(game_score_display);
        //---------------------------------------------

    }

    updateGrid(visible_blocks, updated_container) {
        let block_array = visible_blocks.getChildren();
        const matchesSet = new Set(); // create a set of matches
        for (const block of block_array) { // for every visible block
            const { x, y } = block; // extract it's x and y
            const blockIndex = updated_container.getIndex(block); // get it's index


            if (blockIndex === -1) continue;
            if (block.getData('matched') || block.getData('color') === 'null_block' || block.texture.key === 'null_block') continue;
            // stop searching if the block is invalid in the first place.
            let searchBox = [];
            let searchBoxHori = [];

            if ((block_array.length - blockIndex) >= 16) { // exclude bottom two rows
                searchBox = [ // create array of 3 vertical blocks, filter to make sure all blocks are valid
                    updated_container.getAt(blockIndex),
                    updated_container.getAt(this.indexForPosition(x, y + 60)),
                    updated_container.getAt(this.indexForPosition(x, y + 120)),
                ].filter(b => b);
            }
            if (x <= 300) {
                searchBoxHori = [// exclude right two columns
                    updated_container.getAt(blockIndex),
                    updated_container.getAt(this.indexForPosition(x + 60, y)),
                    updated_container.getAt(this.indexForPosition(x + 120, y)),
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
            //game_score_display += 50;
        });

        this.bubbleUpNull(visible_blocks, updated_container);
    }

    end() {

    }

    bubbleUpNull(visible_blocks, container) {
        for (let i = 0; i < visible_blocks.getChildren().length; i++) {
            let block = container.getAt(i);
            let block_below = container.getAt(this.indexForPosition(block.x, (block.y + 60)))
            if (block_below === undefined || block_below === null) {
                continue;
            }
            if (block_below.getData('color') === "null_block" && (block.getData('matched') == false && block_below.getData('matched') == false)) {
                this.swapColors(block, block_below);
            }
        }
    }
    activateBlocks() {
        red_block_container.each(sprite => {
            if (sprite.getBounds().y < 880) {
                red_visible_blocks.add(sprite);
                sprite.clearTint();
            }
        });

        // add any new visible blue blocks to the group
        block_container.each(sprite => {
            if (sprite.getBounds().y < 880) {
                blue_visible_blocks.add(sprite);
                sprite.clearTint();
            }
        });
    }

    eliminateRow() {
        if (this.checkFirstRowEliminated(block_container)) {

            block_container.removeBetween(0, 8, true);
            this.addRow(block_container);
            primaryBlockIndex[0] -= 60;
            //main_container.y -= 60;
        }
        if (this.checkFirstRowEliminated(red_block_container)) {

            red_block_container.removeBetween(0, 8, true);
            this.addRow(red_block_container);
            primaryBlockIndex_2p[0] -= 60;
            //red_main_container.y -= 60;
        }



    }

    checkFirstRowEliminated(container) {
        let counter = 0;
        for (let index = 0; index < 8; index++) {

            if ((container.getAt(index).getData('color') == 'null_block')) {
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
        const color1 = block1.texture.key;
        const color2 = block2.texture.key;

        if (block1 == null || block2 == null) {
            return;
        }

        if (color1 !== color2) {

            block1.setTexture(color2);
            block2.setTexture(color1);

            block1.setData('color', color2);
            block2.setData('color', color1);
        } else {

        }
    }

    shiftFocus(direction, cursor) {

        if (cursor == boxCursor) {
            switch (direction) {

                case 'left':
                    console.log('cursor1 moves left');
                    boxCursor.x -= 60;
                    primaryBlockIndex[1] -= 60;
                    break;
                case 'right':
                    boxCursor.x += 60;
                    primaryBlockIndex[1] += 60;
                    break;
                case 'up':
                    boxCursor.y -= 60;
                    primaryBlockIndex[0] -= 60;
                    break;
                case 'down':
                    boxCursor.y += 60;
                    primaryBlockIndex[0] += 60;
                    break;
            }
        } else {
            switch (direction) {
                case 'left':
                    console.log('cursor2 moves left');
                    boxCursor2.x -= 60;
                    primaryBlockIndex_2p[1] -= 60;
                    break;
                case 'right':
                    boxCursor2.x += 60;
                    primaryBlockIndex_2p[1] += 60;
                    break;
                case 'up':
                    boxCursor2.y -= 60;
                    primaryBlockIndex_2p[0] -= 60;
                    break;
                case 'down':
                    boxCursor2.y += 60;
                    primaryBlockIndex_2p[0] += 60;
                    break;
            }
        }
    }



    shuffle(array, rng) {

        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(rng() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }

        return array;
    }


    makeRow(increment, rng, host) {

        if (host) {
            const results = [];
            // Randomize blocks using rng
            const randomBlocks = this.shuffle(blockColors.slice(), rng);

            let repeatedColor = randomBlocks[Math.floor(rng() * 8)]; // choose the index of the color to repeat
            randomBlocks.push(repeatedColor);
            let blockPool = randomBlocks;// keep track of how many times the repeated color has appeared
            blockPool = this.shuffle(blockPool.slice(), rng);
            blockPool.pop();

            for (let index = 0; index < 8; index++) {
                const baseBlock = new BaseBlock(this, index * 60, increment, blockPool[index]);
                baseBlock.setData({ color: blockPool[index], matched: false });
                baseBlock.setTint(0x808080);
                results.push(baseBlock);
            }

            rowIncrement += 1;
            return results;




        } else {
            const results = [];

            // Randomize blocks using rng
            const randomBlocks = this.shuffle(blockColors.slice(), rng);


            let repeatedColor = randomBlocks[Math.floor(rng() * 8)]; // choose the index of the color to repeat
            randomBlocks.push(repeatedColor);
            let blockPool = randomBlocks;// keep track of how many times the repeated color has appeared
            blockPool = this.shuffle(blockPool.slice(), rng);
            blockPool.pop();

            for (let index = 0; index < 8; index++) {
                const baseBlock = new BaseBlock(this, index * 60, increment, blockPool[index]);
                baseBlock.setData({ color: blockPool[index], x: rowIncrement, y: index, matched: false });
                //baseBlock.setName('Block' + (rowIncrement) + "-" + index);
                baseBlock.setTint(0x808080);
                results.push(baseBlock);
            }

            rowIncrement += 1;
            return results;
        }

    }


    makeGrid(numRows, rng, host) {
        const gridArray = [];

        for (let row = 0; row < numRows; row++) {
            // Use a different seed for each row by incrementing the base seed value
            // Generate a row of sprites with the current row seed
            const rowSprites = this.makeRow(row * 60, rng, host);

            // Add the row of sprites to the grid array
            gridArray.push(rowSprites);
        }

        return gridArray;
    }

    addRow(container) {
        if (container == red_block_container) {
            var row = this.makeRow((red_lineRow * 60), red_RNG, false);
            container.add(row);
            red_lineRow += 1;
        } else {
            var row = this.makeRow((lineRow * 60), blue_RNG, true);
            container.add(row);
            lineRow += 1;
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

export default MultiplayerGameScene;
