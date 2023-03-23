import { Menu } from "./Menu";
import { Routine } from "./Scheduler";

$(() => {
    Routine.startTask(function*() { 
        Menu.loadMainMenu();
    });
});