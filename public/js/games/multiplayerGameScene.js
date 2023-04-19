import { BaseBlock } from './BaseBlock.js';


var block_container;
var red_block_container;

var main_container;
var red_main_container;

var debugText;
var cursorXYText;
var lineRow;
var red_lineRow;

// object details
var boxCursor;
var boxCursor2
var main_container_blockLevel;

var boxcursorRect;
var block_containerRiseSpeed = 0.115;
var block_containerSpeed = 0.015;


var block_containerChildren;
var red_block_containerChildren;


var delay = 0;

var nameIncrement = 0;

var primaryBlock;
var secondaryBlock;

var FIRST_ROW_OF_NULLS;
var primaryBlockName;
var primaryBlockIndex = [0, 3];

var secondaryBlockName;
var secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 1];
// ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
var primaryBlock_2p;
var secondaryBlock_2p;


var primaryBlockName_2p;
var primaryBlockIndex_2p = [0, 3];

var secondaryBlockName_2p;
var secondaryBlockIndex_2p = [primaryBlockIndex_2p[0], primaryBlockIndex_2p[1] + 1];


var blockColors = ["gold_block", "red_block", "blue_block", "green_block", "orange_block", "pink_block", "purple_block", "indigo_block"];


// Game rules
var numRows;
var left, right, up, down, swap, bugR, bugE, remove, speedUpBtn;


// check match
var checkLength = 10;

var checkStart = 0;

// score

var game_time_display, time_display; // keeps track of game time
var timer_hours, timer_min, timer_seconds;

var game_score_display, score_display, speed_display; // current score from matches

var game_mode_display; // current gamemode

var game_speed_display; // current game speed
var game_speed_text;
var game_speed = 1.00;

var timer;
var user;
var self;
let rngSeedSource;
let red_RNG;
let blue_RNG;
let blue_visible_blocks;
let red_visible_blocks;

class MultiplayerGameScene extends Phaser.Scene {



    constructor(config) {
        super({ key: 'multiplayerGameScene' });
        this.ably = config.ably;
        this.user = config.user;
        console.log('constructor has run')

    }

    init(data) {
        this.user = data.user;
        this.rngSeed = data.rngSeed;
        this.currentMatch = this.ably.channels.get(data.channelName);
        console.log('currentMatch is made with channelname')
        block_containerRiseSpeed = 0.000005;
        nameIncrement = 0;
        primaryBlockIndex = [0, 3];
        secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 1];

        numRows = 8;
        main_container_blockLevel = 4;


        block_containerChildren = [];
        red_block_containerChildren = [];


        debugText;

        game_speed_display;
        game_speed_text; // current game speed

        game_speed = 1.00;


        //
        checkLength = 5;
        checkStart = 0;
        //

        //MODE
        //timer = data.timer;
        //
        FIRST_ROW_OF_NULLS = [];

        timer_hours = 0;
        timer_min = 0;
        timer_seconds = 0;
        game_score_display = 0, score_display; // current score from matches

        if (timer) {
            game_mode_display = "Time Trial"; // current gamemode
        } else {
            game_mode_display = "Endless"; // current gamemode
        }

        game_speed_display = "<< " + game_speed.toFixed(2) + " >>"; // current game speed

        block_container;
        main_container;


        red_block_container;
        red_main_container;


        lineRow = numRows;
        red_lineRow = numRows;
        self = this;
        rngSeedSource = this.rngSeed;
        //RowRngOffset = 1;
        red_RNG = new Math.seedrandom(rngSeedSource);
        blue_RNG = new Math.seedrandom(rngSeedSource);

        //

        blue_visible_blocks;
        red_visible_blocks;
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


        blue_visible_blocks = this.add.group();
        red_visible_blocks = this.add.group();



        console.log('PRE-subscribe event:');
        this.currentMatch.subscribe('player-keypress', (message) => {
            console.log('------player-keypress heard something-------')
        if(message.data.user.id != this.user.id){
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



        // add background and border
        var bg = this.add.image(0, 0, 'white_background');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;
        // -------------------------

        // TESTING SQUARE
        //var testPlus = this.add.image(0.5, 0.5, "testPlus").setScale(4);
        // ---------------

        // Add block_container, position origin at cent of screen offset -210

        block_container = this.add.container((screen.width / 4) - 210, screen.height / 2 + 215, this.makeGrid(numRows, blue_RNG).flat());
        const block = new BaseBlock(this, 200, 200, 'red_block');
        block.spinToDisappear();

        //console.log(block.scaleX, block.scaleY);
        ///console.log(block.visible);
        // ------------------------------------------------------------

        main_container = this.add.container(0, 0);
        main_container.add(block_container);


        // Add blue bordered game boundry
        var grid_box = this.add.container(screen.width / 4, (screen.height / 2))
        grid_box.add([this.add.image(0, 10, "blueBorder")]);
        this.add.text(240, -20, "_______________", { font: '92px Bernard', fill: '#000000' });



        // (#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@)

        red_block_container = this.add.container((screen.width / 1.5) + 111, screen.height / 2 + 215, this.makeGrid(numRows, red_RNG, false).flat());

        // ----------------------------------------------------------------------------

        red_main_container = this.add.container(0, 0);
        red_main_container.add(red_block_container);


        var red_grid_box = this.add.container(screen.width / 1.2, (screen.height / 2))
        red_grid_box.add([this.add.image(0, 10, "redBorder")]);
        this.add.text(240, -20, "_______________", { font: '92px Bernard', fill: '#000000' });
        // (#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@)


        // --------------------------------
        red_block_container.each(sprite => {
            if (sprite.y < 780) {
                red_visible_blocks.add(sprite);
                sprite.setAlpha(1);
            }
        });


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

        red_block_container.on('childMoved', (child) => {
            if (child.y < 780) {
                red_visible_blocks.add(child);
                child.setAlpha(1);
            }
        });
        // --------------------------------

        // scoreboard

        var score_box = this.add.container(screen.width / 1.97, (screen.height / 2.55));
        score_box.add([this.add.image(0, 0, "score_board")]);

        score_box.add(this.add.text(-30, -300, 'Time', { font: '32px Bernard', fill: '#000000' }));
        score_box.add(time_display = this.add.text(-40, -250, ':: ' + game_time_display + ' ::', { font: '32px Bernard', fill: '#000000' }));

        score_box.add(this.add.text(-230, -230, "_____________________________", { font: '32px Bernard', fill: '#000000' }));

        score_box.add(this.add.text(-30, -150, 'Score', { font: '32px Bernard', fill: '#000000' }));
        score_box.add(score_display = this.add.text(-55, -100, '||     ' + game_score_display + '     ||', { font: '32px Bernard', fill: '#000000' }));

        score_box.add(this.add.text(-230, -70, "_____________________________", { font: '32px Bernard', fill: '#000000' }));

        score_box.add(this.add.text(-30, 0, 'Mode', { font: '32px Bernard', fill: '#000000' }));
        score_box.add(this.add.text(-70, 50, ':: ' + game_mode_display + ' ::', { font: '32px Bernard', fill: '#000000' }));

        score_box.add(this.add.text(-230, 80, "_____________________________", { font: '32px Bernard', fill: '#000000' }));

        score_box.add(this.add.text(-30, 150, 'Speed', { font: '32px Bernard', fill: '#000000' }));
        score_box.add(speed_display = this.add.text(-60, 200, game_speed_display, { font: '32px Bernard', fill: '#000000' }));

        debugText = this.add.text(0, 400, 'testing', { font: '32px Bernard', fill: '#000000' });

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
        boxCursor.setPosition(480, 755);
        boxCursor.setScale(1.1);
        //------------------------------

        // Create Cursor
        boxCursor2 = this.add.sprite(0, 0, 'cursor2');
        boxCursor2.setName('BoxCursor2');
        red_main_container.add(boxCursor2);
        boxCursor2.setPosition(1600, 755);
        boxCursor2.setScale(1.1);

        // Create array of all current blocks for testing
        //---------------------------------------------
        // block_container.children.iterate(function(element){
        // 	element.setInteractive();
        // })

        red_block_container.getAll().forEach(element => {
            element.name += '_2';
        });

        /*
                                      ___      .______    __      ____    ____
                                     /   \     |   _  \  |  |     \   \  /   /
                                    /  ^  \    |  |_)  | |  |      \   \/   /
                                   /  /_\  \   |   _  <  |  |       \_    _/
                                  /  _____  \  |  |_)  | |  `----.    |  |
                                 /__/     \__\ |______/  |_______|    |__|
        */

        //PhaserGUIAction(this);
    }

    update(time, delta) {
        // update text
        let deltaTime = (0.001 * delta);
        let fixedTime = deltaTime;
        timer_seconds += (fixedTime);

        if (timer_seconds.toFixed(2) == 60) {
            timer_seconds = 0;
            timer_min += 1;

            if (timer_min.toFixed(2) == 60) {
                timer_seconds = 0;
                timer_min = 0;
                timer_hours += 1;
            }
        } else if (timer_seconds.toFixed(2) % 5 == 0) {
            block_containerSpeed += 0.001;

            game_speed += 0.0001
            speed_display.setText("<< " + game_speed + " >>");
        }
        time_display.setText(timer_hours + ":0" + timer_min + ":" + timer_seconds.toFixed(1));




        this.adjustLevel();
        // ------------


        boxcursorRect = boxCursor.getBounds();
        // check for match
        // remove
        // raise
        cursorXYText = block_container.getByName('BoxCursor') + ": x:" + boxcursorRect.x + "| y: " + boxcursorRect.y;

        // HOVERED BLOCK INFORMATION _____________________________________________________
        primaryBlock = block_container.getAt(this.indexForPosition(primaryBlockIndex[1], primaryBlockIndex[0]));
        secondaryBlock = block_container.getAt(this.indexForPosition((primaryBlockIndex[1] + 1), primaryBlockIndex[0]));
        //primaryBlockName = "Block" + primaryBlockIndex[0] + "-" + primaryBlockIndex[1];
        //secondaryBlockIndex = [primaryBlockIndex[0], primaryBlockIndex[1] + 1];
        //primaryBlock = block_container.getByName(primaryBlockName);


        //secondaryBlockName = "Block" + secondaryBlockIndex[0] + "-" + secondaryBlockIndex[1];


        // -=--------------------------------------------------------------------------

        // primaryBlockName_2p = "Block" + primaryBlockIndex_2p[0] + "-" + primaryBlockIndex_2p[1];
        // secondaryBlockIndex_2p = [primaryBlockIndex_2p[0], primaryBlockIndex_2p[1] + 1];
        primaryBlock_2p = red_block_container.getAt(this.indexForPosition(primaryBlockIndex_2p[1], primaryBlockIndex_2p[0]));
        secondaryBlock_2p = red_block_container.getAt(this.indexForPosition((primaryBlockIndex_2p[1] + 1), primaryBlockIndex_2p[0]));

        // secondaryBlockName_2p = "Block" + secondaryBlockIndex_2p[0] + "-" + secondaryBlockIndex_2p[1] + "_2";
        // secondaryBlock_2p = red_block_container.getByName(secondaryBlockName_2p);


        // _______________________________________________________________________________

        // Update and listen for directional cursor movement
        if (Phaser.Input.Keyboard.JustDown(left) && boxcursorRect.x > 248) {
            //boxCursor.x -= 60;
            console.log('shiftFocus boxCursor, left')
            this.shiftFocus('left', boxCursor);
            console.log('player-keypress PUBLISH left')
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'left' });



        } else if (Phaser.Input.Keyboard.JustDown(right) && boxcursorRect.x < 600) {
            //boxCursor.x += 60;
            this.shiftFocus('right', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'right' });

        }

        if (Phaser.Input.Keyboard.JustDown(up) && boxcursorRect.y > 65) {
            //boxCursor.y -= 60;
            this.shiftFocus('up', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'up' });


        } else if (Phaser.Input.Keyboard.JustDown(down) && boxcursorRect.y < 842) {
            //boxCursor.y += 60;
            this.shiftFocus('down', boxCursor);
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'down' });

        }

        if (boxcursorRect.y < 65) {
            boxCursor.y += 60;
            this.shiftFocus('down', boxCursor);
        }

        if (Phaser.Input.Keyboard.JustDown(swap)) {
            // block_container.remove(primaryBlock);
            console.log(primaryBlock)
            if (primaryBlock == null || secondaryBlock == null) {
                // console.log(block_container.getAt("ifp:"+this.indexForPosition(primaryBlockIndex[0], primaryBlockIndex[1])));
                // console.log(this.indexForPosition(primaryBlockIndex[0], primaryBlockIndex[1]));
            } else {
                // console.log(primaryBlock_2p.texture.key)


                this.swapColors(primaryBlock, secondaryBlock);
            }
            this.currentMatch.publish('player-keypress', { user: this.user, key: 'space', primary: primaryBlock_2p, secondary: secondaryBlock_2p });



        }
        if (Phaser.Input.Keyboard.JustDown(speedUpBtn)) {
            // block_container.remove(primaryBlock);
            //block_containerSpeed += 0.05;
            // console.log(boxcursorRect.x);
            // console.log(boxcursorRect.y);


        }

        // ________    SWAP BLOCKS _________

        if (Phaser.Input.Keyboard.JustDown(remove)) {
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


        //------------------------------------------------------------

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

        // SPEED CONTROL
        block_containerRiseSpeed += (block_containerSpeed * delta);

        //main_container.y = (0 - block_containerRiseSpeed);
        //red_main_container.y = (0 - block_containerRiseSpeed);


        if (block_container.getBounds().y <= 68) {

            this.scene.start('gameoverScene', { score: this.score_display, win: true, user: this.user });
        }

        if (red_block_container.getBounds().y <= 68) {
            this.scene.start('gameoverScene', { score: this.score_display, win: false, user: this.user });
        }

        // if ((block_container.getAt((main_container_blockLevel * 8) - 1).getBounds().y) > 880){

        // }




        // ----------------------------------------------------------------------------------------------------

        if ((time % 60) == 0) {

            this.eliminateRow();
            this.matchof4Vert();
            this.matchOf3Vert(block_container);
            this.matchOf3Vert(red_block_container);
            this.matchof4Hori();
            this.matchOf3Hori();
            this.activateBlocks();


            this.bubbleUpNull();
            score_display.setText(game_score_display);
        }
        // if (delay == 100){

        // 	//this.eliminateRow();

        // 	delay = 0;
        // } else if (delay == 50) {

        // 	delay += 2;
        // } else {
        // 	delay += 2;
        // }
        // ---------------




        // Update Debug information

        // debugText.setText([
        // 	"checking setup:",
        // 	"testing debug: " + cursorXYText,
        // 	"lft-hovBlkIndex: " + primaryBlockIndex,
        // 	"main_container.y: " + main_container.getBounds().height,
        // ])
        debugText.setText([
            ""
        ])


        //---------------------------------------------

    }

    end() {

    }

    bubbleUpNull() {
        try {

            red_visible_blocks.forEach(block => {
                let first_position = [block.x, block.y];
                console.log(first_position)

            });
            // for (let row = 0; row < numRows - 1; row++) {
            //     for (let column = 0; column < 8; column++) {

            //         let top = (8 * row) + column
            //         let bot = (8 * (row + 1)) + column

            //         let block1 = block_container.getAt(top);
            //         //console.log(block1)
            //         let block2 = block_container.getAt(bot);

            //         let red_block1 = red_block_container.getAt(top);
            //         //console.log(block1)
            //         let red_block2 = red_block_container.getAt(bot);

            //         //console.log(block2)

            //         if (block2.getData('color') == 'null_block' && block1.getData('color') != 'null_block') {
            //             this.swapColors(block1, block2);
            //         }
            //         if (red_block2.getData('color') == 'null_block' && red_block1.getData('color') != 'null_block') {
            //             this.swapColors(red_block1, red_block2);
            //         }
            //     }
            // }
        } catch (error) {
            return;
        }
    }

    matchOf3Vert(container) {

        try {
            for (let row = 0; row < numRows - 2; row++) {
                for (let column = 0; column < 8; column++) {

                    let top = (8 * row) + column
                    let mid = (8 * (row + 1)) + column
                    let bot = (8 * (row + 2)) + column

                    let block1 = container.getAt(top);
                    let block2 = container.getAt(mid);
                    let block3 = container.getAt(bot);

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
        } catch (error) {
            return
        }
    }
    matchOf3Hori() {

        try {
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
        } catch (error) {
            return
        }
    }

    matchof4Vert() {
        try {
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
        } catch (error) {
            return
        }
    }
    matchof4Hori() {
        try {
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
        } catch (error) {
            return
        }
    }

    bombExplosion() {

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
            primaryBlockIndex[0] -= 1;
            //main_container.y -= 60;
        }
        if (this.checkFirstRowEliminated(red_block_container)) {

            red_block_container.removeBetween(0, 8, true);
            this.addRow(red_block_container);
            primaryBlockIndex_2p[0] -= 1;
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
        const color1 = block1.getData('color');
        const color2 = block2.getData('color');


        if (color1 !== color2) {
            block1.setTexture(color2);
            block2.setTexture(color1);

            block1.setData('color', color2);
            block2.setData('color', color1);
        }
    }

    shiftFocus(direction, cursor) {

        if (cursor == boxCursor) {
            switch (direction) {

                case 'left':
                    console.log('cursor1 moves left');
                    boxCursor.x -= 60;
                    primaryBlockIndex[1] -= 1;
                    break;
                case 'right':
                    boxCursor.x += 60;
                    primaryBlockIndex[1] += 1;
                    break;
                case 'up':
                    boxCursor.y -= 60;
                    primaryBlockIndex[0] -= 1;
                    break;
                case 'down':
                    boxCursor.y += 60;
                    primaryBlockIndex[0] += 1;
                    break;
            }
        } else {
            switch (direction) {
                case 'left':
                    console.log('cursor2 moves left');
                    boxCursor2.x -= 60;
                    primaryBlockIndex_2p[1] -= 1;
                    break;
                case 'right':
                    boxCursor2.x += 60;
                    primaryBlockIndex_2p[1] += 1;
                    break;
                case 'up':
                    boxCursor2.y -= 60;
                    primaryBlockIndex_2p[0] -= 1;
                    break;
                case 'down':
                    boxCursor2.y += 60;
                    primaryBlockIndex_2p[0] += 1;
                    break;
            }
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
                baseBlock.setData({ color: blockPool[index], x: nameIncrement, y: index, matched: false });
                //baseBlock.setName('Block' + (nameIncrement) + "-" + index);
                baseBlock.setTint(0x808080);
                results.push(baseBlock);
            }

            nameIncrement += 1;
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
                baseBlock.setData({ color: blockPool[index], x: nameIncrement, y: index, matched: false });
                //baseBlock.setName('Block' + (nameIncrement) + "-" + index);
                baseBlock.setTint(0x808080);
                results.push(baseBlock);
            }

            nameIncrement += 1;
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
        x = x;
        y = y;
        //console.log('x'+x+'|y: '+ y)
        return (y * 8 + x);
    }

    positionForIndex(i) {
        return [i % 8 * 60, Math.floor(i / 8) * 60];
    }
}

export default MultiplayerGameScene;
