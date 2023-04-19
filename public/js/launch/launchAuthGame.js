import SingleplayerGameScene from "../games/singleplayerGameScene.js";
import MultiplayerGameScene from "../games/multiplayerGameScene.js";
import GuestTitleScene from "../title/guestTitleScene.js";
import GameoverScene from "../transitionScenes/gameoverScene.js";
import AuthTitleScene from "../title/authTitleScene.js";
import LobbyScene from "../transitionScenes/lobbyScene.js";


const xhr = new XMLHttpRequest();
xhr.open("GET", "/getUser");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onload = () => {
    if (xhr.status === 200) {
        const user = JSON.parse(xhr.response);
        var ably = new Ably.Realtime({
            key: 'Jn3neg.6ORxrw:51njAEu0j3jTkoTwascniu_bvpsIMQOpjfmbtyijZWA',
            clientId: user.id + user.name,
            // screenname: user.screenname
        });
        console.log(user);
        const config = {
            type: Phaser.AUTO,
            width: screen.width,
            height: screen.height,
            scale: {
                parent: "gameDiv",
                mode: Phaser.Scale.FIT,
            },
            user: user,
            ably: ably,
        };
        // Create the game with the config
        const game = new Phaser.Game(config);
        // Add all the scenes and pass the config object as a parameter to each scene
        game.scene.add("guestTitleScene", new GuestTitleScene(config));
        game.scene.add("singleplayerGameScene", new SingleplayerGameScene(config));
        game.scene.add("gameoverScene", new GameoverScene(config));
        game.scene.add("authTitleScene", new AuthTitleScene(config));
        game.scene.add("multiplayerScene", new MultiplayerGameScene(config));
        game.scene.add("lobbyScene", new LobbyScene(config));

        // Start the title scene
        game.scene.start("authTitleScene");
    } else {
        console.error("Unable to find User", xhr.statusText);
    }
};
xhr.onerror = () => {
    console.error("Error: Cannot find User", xhr.statusText);
};
xhr.send();
