import { Console } from "./Console";
import LoginMenu from "./Game/Games/LoginMenu";
import MenuScreen from "./Game/Games/MenuScreen";
import { GameLoader } from "./GameLoader";
import { Saves } from "./SaveManager";

$(async () => {
    Console.initialize();
    
    Saves.load();

    await GameLoader.load(LoginMenu).then(game => game.start());
    
    while (GameLoader.inscope) {
        
        Saves.load();
        
        await GameLoader.load(MenuScreen).then(game => {
            const timeSinceLastLogin = Date.now() - Saves.getLastLogin();
            game.skipOpening = timeSinceLastLogin <= 1000 * 60 * 60 * 3;
    
            return game.start();
        });
    }
});