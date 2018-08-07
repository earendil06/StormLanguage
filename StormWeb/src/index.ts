import Term from "./term/Main";
import Ide from "./ide/Main";
import * as $ from "jquery"
import Engine from "./engine/Engine";

/*let action = new (window as any).Action("a","a","q","s","e","desctoto") as Action;
console.log("ototototot");
console.log(action);
console.log(action.description);*/

let engine = new Engine();
engine.newMonster("toto", {name:"goblin", actions: [], stats: [], abilityScores: [], features:[]});
console.log(engine.getEncounterData().monsters);

if ($("#container").length > 0) {
    Term.main();
} else {
    Ide.main();
}
