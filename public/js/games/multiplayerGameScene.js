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
var boxcursorRect2;
var block_acceleration = 0.15;

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
var jump;
var jumpValue;

// Check match
var checkLength = 10;

var game_speed = 1.00;

// RNG and visible blocks
let rngSeedSource;
let red_RNG;
let blue_RNG;
let blue_visible_blocks;
let red_visible_blocks;

// Column array
let columnArray;
let movesList = [];
class MultiplayerGameScene extends Phaser.Scene {



    constructor(config) {
        super({ key: 'multiplayerGameScene' });

        this.user = config.user;
        console.log('constructor has run')

    }

    init(data) {
        this.ably = data.ably;
        this.user = data.user;
        this.enemy = data.enemy;
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
        jump = false;
        jumpValue = 0;
        movesList = [];
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

        this.load.image('yourImage', '/img/profile/' + this.user.pfp);
        this.load.image('theirImage', '/img/profile/' + this.enemy.pfp)


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
                        red_main_container.y -= 10;
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
        block_container = this.add.container((screen.width / 4) - 370 , screen.height / 2 + 215, this.makeGrid(numRows, blue_RNG).flat());
        main_container = this.add.container(0, 0);
        main_container.add(block_container);


        // Add blue bordered game boundry
        var grid_box = this.add.container(screen.width / 4 - 160, (screen.height / 2))
        grid_box.add([this.add.image(0, 10, "blueBorder")]);
        this.add.text(70, -20, "___________", { font: '92px Bernard', fill: '#000000' });

        block_container.each(sprite => {
            if (sprite.y < 780) {
                blue_visible_blocks.add(sprite);
                sprite.setAlpha(1);
            }
        });
        /*------------------------------------------------------------------------------------------------------------------------------------------


                            <<Create user names


        */
        this.add.text(200, 35, this.user.screenname, { font: '44px Bernard', fill: '#000000' });
        this.add.text(1530, 35, this.enemy.screenname, { font: '44px Bernard', fill: '#000000' });

        this.add.image(690, 110, 'yourImage').setScale(1.5);
        this.add.image(1230, 110, 'theirImage').setScale(1.5);

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

        /*
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
        speedUpBtn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        /*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Created both cursor objects


*/
        // Create Cursor
        boxCursor = this.add.sprite(0, 0, 'cursor');
        boxCursor.setName('BoxCursor');
        main_container.add(boxCursor);
        boxCursor.setPosition(320, 755);
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
                    <<Update container rise speed
*/
        // block_acceleration += (block_containerSpeed * delta);
        // main_container.y = (block_acceleration*-1);
        // red_main_container.y = (block_acceleration*-1);


        block_acceleration = block_containerSpeed * delta;
        main_container.y -= block_acceleration;
        red_main_container.y -= block_acceleration;


        if (time % 60 == 0) {

            if (movesList.length > 0) {
                const move = movesList[0];
                move();
                movesList.shift();
            }
        }
    /*------------------------------------------------------------------------------------------------------------------------------------------


                <<Update Your cursor position, and the tracking for cursor2. get blocks that both cursors hover over.


*/
    boxcursorRect = boxCursor.getBounds();
    boxcursorRect2 = boxCursor2.getBounds();

    primaryBlock = block_container.getAt(this.indexForPosition(primaryBlockIndex[1], primaryBlockIndex[0]));

    secondaryBlock = block_container.getAt(this.indexForPosition((primaryBlockIndex[1] + 60), primaryBlockIndex[0]));



    primaryBlock_2p = red_block_container.getAt(this.indexForPosition(primaryBlockIndex_2p[1], primaryBlockIndex_2p[0]));

    secondaryBlock_2p = red_block_container.getAt(this.indexForPosition((primaryBlockIndex_2p[1] + 60), primaryBlockIndex_2p[0]));


    /*------------------------------------------------------------------------------------------------------------------------------------------


                <<Update cursor based on directional input


*/
    if(Phaser.Input.Keyboard.JustDown(left) && boxcursorRect.x > 81) {
    this.shiftFocus('left', boxCursor);
    this.currentMatch.publish('player-keypress', { user: this.user, key: 'left' });

} else if (Phaser.Input.Keyboard.JustDown(right) && boxcursorRect.x < 420) {
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

if (Phaser.Input.Keyboard.JustDown(swap)) {

    console.log('pressed space')
    this.swapColors(primaryBlock, secondaryBlock);
    this.currentMatch.publish('player-keypress', { user: this.user, key: 'space', primary: primaryBlock_2p, secondary: secondaryBlock_2p });


}

if (Phaser.Input.Keyboard.JustDown(speedUpBtn)) {
    this.speedUp(main_container);
    this.currentMatch.publish('player-keypress', { user: this.user, key: 'shift' });
}

if (boxcursorRect.y < 65) {
    // boxCursor.y += 60;
    this.shiftFocus('down', boxCursor);
    //this.currentMatch.publish('player-keypress', { user: this.user, key: 'down' });
}

if (boxcursorRect2.y < 65) {
    // boxCursor2.y += 60;
    this.shiftFocus('down', boxCursor2);
    //this.currentMatch.publish('player-keypress', { user: this.user, key: 'down' });
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
    console.log(primaryBlock)

}

if (Phaser.Input.Keyboard.JustDown(bugE)) {
    console.log([
        boxCursor.getBounds().x
    ]);
}


/*------------------------------------------------------------------------------------------------------------------------------------------


            <<Speed control, determining rising of containers.


*/



if (block_container.getBounds().y <= 68) {

    this.scene.start('gameoverScene', { win: false, user: this.user, ably: this.ably });
}

if (red_block_container.getBounds().y <= 68) {
    this.scene.start('gameoverScene', { win: true, user: this.user, ably:this.ably});
}
/*------------------------------------------------------------------------------------------------------------------------------------------


                    <<Methods for your grid management.


*/

this.activateBlocks();
this.eliminateRow(block_container);
this.eliminateRow(red_block_container);

this.updateGrid(blue_visible_blocks, block_container);
this.updateGrid(red_visible_blocks, red_block_container);

this.eliminateRow(block_container);
this.eliminateRow(red_block_container);

this.bubbleUpNull(blue_visible_blocks, block_container);
this.bubbleUpNull(red_visible_blocks, red_block_container);
        //---------------------------------------------

    }

queueMove(move){
    switch (move) {
        case 'left':
            movesList.push(this.shiftFocus('left', boxCursor2));
            break;
        case 'right':
            movesList.push(this.shiftFocus('right', boxCursor2));
            break;
        case 'up':
            movesList.push(this.shiftFocus('right', boxCursor2));
            break;
        case 'down':
            movesList.push(this.shiftFocus('right', boxCursor2));
            break;
        case 'space':
            movesList.push(this.swapColors(primaryBlock_2p, secondaryBlock_2p));
            break;
        case 'shift':
            movesList.push(this.speedUp(red_main_container));
            break;
        default:
            break;
    }
}

speedUp(container){
    container.y -= 10
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
        block.spinToDisappear();
        console.log(block.getData('color'));
        //game_score_display += 50;
    });


}

end() {

}

/*------------------------------------------------------------------------------------------------------------------------------------------


                        <<Methods for bubbling nulls and activating the grid blocks


    */
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
/*------------------------------------------------------------------------------------------------------------------------------------------


                            <<Methods for removing and adding a row


        */
eliminateRow(container) {
    if (this.checkFirstRowEliminated(container)) {

        container.removeBetween(0, 8, true);
        this.addRow(container);

        container.iterate(function (block) {
            block.y -= 60;
        });


        container.y += 60;
        if (container == block_container) {
            primaryBlockIndex[0] -= 60;
            //this.currentMatch.publish('player-keypress', { user: this.user, key: 'down' });
        } else {
            primaryBlockIndex_2p[0] -= 60;
            //this.shiftFocus('up', boxCursor2);
        }
    }

}

checkFirstRowEliminated(container) {
    const firstEightBlocks = container.getAll().slice(0, 8);
    const allNullBlocks = firstEightBlocks.every(block => block.getData('color') === 'null_block');
    return allNullBlocks;
}

addRow(container) {
    if (container == red_block_container) {
        var row = this.makeRow((red_lineRow * 60), red_RNG, false);
        container.add(row);
        //red_lineRow += 1;
    } else {
        var row = this.makeRow((lineRow * 60), blue_RNG, true);
        container.add(row);
        //lineRow += 1;
    }
}
/*------------------------------------------------------------------------------------------------------------------------------------------


                        <<Methods for switching and moving


    */
swapColors(block1, block2) {
    if ((block1 == null || block2 == null) || (block1.getData('matched') || block2.getData('matched'))) {
        return;
    }
    const color1 = block1.texture.key;
    const color2 = block2.texture.key;



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

/*------------------------------------------------------------------------------------------------------------------------------------------


                        <<Methods for making the grid


    */
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
            baseBlock.setData({ color: blockPool[index], matched: false });
            baseBlock.setTint(0x808080);
            results.push(baseBlock);
        }

        rowIncrement += 1;
        return results;
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
/*------------------------------------------------------------------------------------------------------------------------------------------


                            <<Methods for indexes and positions


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

export default MultiplayerGameScene;
