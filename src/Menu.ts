import MapEditor from "./Game/MapEditor";
import TowerDefense from "./Game/TowerDefense";
import { GameLoader } from "./GameLoader";
import { Saves } from "./SaveManager";

export namespace Menu {
    export function loadMainMenu() {
        const $savesSelector = $<HTMLSelectElement>("#saves");

        $("header").hide();
    
        $savesSelector.on("change", e => {
            if (e.target.value) {
                $("#load").removeAttr("disabled");
                $("#delete").removeAttr("disabled");
            }
        });
    
        $("#create").on("click", () => {
            const saveName = $<HTMLInputElement>("#name")[0];
            const saveID = Saves.createSave(saveName.value || "Unnamed save");
            
            saveName.value = "";
            refreshSavesMenu();
    
            $savesSelector.val(saveID);
        });
        
        $("#delete").on("click", () => {
            const save = $savesSelector.val();
    
            if (save) {
                if (Saves.deleteSave(save.toString()))
                    refreshSavesMenu();
                else
                    alert("Failed to delete that save");
            }
        });
    
        $("#load").on("click", () => {
            const save = $savesSelector.val();
    
            if (save) {
                Saves.currentSaveID = save.toString();
                GameLoader.load(TowerDefense);
            }
        });
    
        $("#map-edit").on("click", () => {
            GameLoader.load(MapEditor);
        });
    
        $(window).on('beforeunload', () => {
            Saves.save();
        });
    
        refreshSavesMenu();
    }

    function refreshSavesMenu() {
        Saves.load();
    
        const $savesSelector = $<HTMLSelectElement>("#saves");
        const saveIDs = Saves.listSaveIDs();
    
        $savesSelector.empty();
    
        $savesSelector.append($("<option>", {
            "disabled": "disabled",
            "selected": true,
            "label": "Choose a save..."
        }));
    
        $savesSelector.append($("<option>", {
            "disabled": "disabled",
            "label": saveIDs.length === 0 ? "You have no saves yet... L BOZO" : ""
        }));
    
        for (let id of saveIDs) {
            Saves.currentSaveID = id;
            if (Saves.getSave()) {
                const dateString = new Date(Saves.currentSaveData.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    second: "numeric",
                    minute: "numeric",
                    hour: "numeric"
                });
    
                $savesSelector.append($(`<optgroup label="Save #${id}">
                    <option value="${id}">${Saves.currentSaveData.name}</option>
                    <option disabled>Created on ${dateString}</option>
                </optgroup>`));
            }
        }
    
        if (saveIDs.length > 0) {
            $savesSelector.val(saveIDs[0]);
            $savesSelector.triggerHandler("change");
        }
    }
}