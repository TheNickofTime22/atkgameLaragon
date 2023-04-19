

export default class LobbyScene extends Phaser.Scene {

    constructor(config) {
        super({ key: 'lobbyScene' });
        this.user = config.user;
        this.ably = config.ably;
        this.controllerChannel = this.ably.channels.get('configChannel');
    }


    preload() {
        this.load.image('lobbybackground', '/img/lobbyBackground.png');
        this.load.image('orange', "/img/orange_block_lg.png");
        this.load.bitmapFont('smooth', '/img/atari-smooth.png', '/img/atari-smooth.xml');
    }

    init(data) {
        this.controllerChannel.subscribe('start-the-match', (message) => {
            console.log("YOU DID IT "+ message.data.user.screenname +", STARTING THE GAME!!!");
            this.add.bitmapText(300, 450, 'smooth', 'Connecting to game...');

            this.scene.start('multiplayerGameScene', {user: this.user, channelName: message.data.channelName, rngSeed: message.data.rngSeed})
        });
    }

    create() {
        var bg = this.add.sprite(0, 0, 'lobbybackground');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;
        console.log("DEBUG: You want to play multiplayer")

        const JoinGame = this.add.bitmapText(1100, 450, 'smooth', "Join Match").setInteractive();
        const HostGame = this.add.bitmapText(150, 450, 'smooth', "Host Match").setInteractive();

        HostGame.on('pointerdown', () => {
            console.log("Host Pre match send: " + this.user)
            //this.scene.start('preMatchScene', {user_host: this.user, isHost: true})
            this.clearItems(JoinGame, HostGame);
            this.hostCreate();
        });

        JoinGame.on('pointerdown', () => {
            //this.scene.start('preMatchScene', {user_challenger: this.user, isHost: false})
            console.log("Join Pre match send: " + this.user)
            this.clearItems(JoinGame, HostGame);
            this.joinCreate();
        });
    }

    clearItems(join, host){
        // erase the two options
        join.destroy();
        host.destroy();
    }

    hostCreate(){
        // create the things the host needs to see.
        const randomString = this.generateRandomString(10);
        const randomSeed = this.generateRandomString(20);
        const generated_LOBBYNAME = "generatedLobby:" + randomString;
        this.add.bitmapText(300, 50, 'smooth', "You are hosting a lobby")


        // listen for the host being created
        // ------1b------
        this.controllerChannel.subscribe('I-wanna-join-a-host', (message) =>{
            console.log('I am user: ' + message.data.user.screenname +". I wanna join you.");

            // agree to let them join, tell them who you are, the channel name, and the rng you'll use
            // ------2a------
            this.controllerChannel.publish('okay-here-is-the-info', { user: this.user, channelName: generated_LOBBYNAME, rngSeed: randomSeed});

        });

        // listen for a message when the joiner joins
        // ------3b------
        this.controllerChannel.subscribe('Gotcha-joining-now', (message) =>{
            console.log("Nice to play with you " + message.data.user.screenname + ". Lets start...");
            this.controllerChannel.publish('let-start-together', {user: this.user});

            // this.controllerChannel.publish('start-the-match', {user: this.user, channelName: generated_LOBBYNAME, rngSeed: randomSeed});
        });
    }

    // client
    joinCreate(){
        // create the things the joiner needs to see.
        let join_text = this.add.bitmapText(360, 50, 'smooth', "Join a lobby below")
        let randomSeed;
        let channelName;

        // ------2b------
        this.controllerChannel.subscribe('okay-here-is-the-info', (message) => {
            console.log('Gotcha ' + message.data.user.screenname);
            randomSeed = message.data.rngSeed;
            channelName = message.data.channelName;

            // ------3a------
            this.controllerChannel.publish('Gotcha-joining-now', { user: this.user });
        })
        // ------1a------
        this.controllerChannel.publish("I-wanna-join-a-host", { user: this.user });
        // listen for messages coming in when a user wants to join a match.

        this.controllerChannel.subscribe('let-start-together', (message) =>{
            console.log('okay, starting')


            this.controllerChannel.publish('start-the-match', { user:this.user, channelName: channelName, rngSeed: randomSeed })


        });
    }

    generateRandomString(length){
        return Array.from({length}, () =>
            String.fromCharCode(Math.floor(Math.random() * 94) + 33)
            ).join('');
    }
}
