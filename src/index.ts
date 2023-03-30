import { Console } from "./Console";
import LoginMenu from "./Game/Games/LoginMenu";
import MenuScreen from "./Game/Games/MenuScreen";
import { GameLoader } from "./GameLoader";

$(async () => {
    Console.initialize();
    
    await GameLoader.load(LoginMenu).then(game => game.waitForGameEnd());
    
    await GameLoader.load(MenuScreen).then(game => {
        return game.waitForGameEnd();
    });

    Console.log(`Sequence End`);
});