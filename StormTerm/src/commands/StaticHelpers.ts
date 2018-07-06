import {ClearCommand} from "./ClearCommand";
import {BlockCommand} from "./BlockCommand";
import {HelpCommand} from "./HelpCommand";
import {NewCommand} from "./NewCommand";
import {GetMonsterCommand} from "./GetMonsterCommand";
import {GetEncounterDataCommand} from "./GetEncounterDataCommand";
import {RollInitiativeCommand} from "./RollInitiativeCommand";
import {DamageCommand} from "./DamageCommand";
import {GetTurnCommand} from "./GetTurnCommand";
import {ResetCommand} from "./ResetCommand";
import {NextTurnCommand} from "./NextTurnCommand";
import {HealCommand} from "./HealCommand";
import {RemoveCommand} from "./RemoveCommand";
import {SetInitiativeCommand} from "./SetInitiativeCommand";
import {GetBlocksCommand} from "./GetBlocksCommand";
import {GetPlayingMonsterCommand} from "./GetPlayingMonsterCommand";

export class StaticHelpers {
    static hideSpinner(): void {
        document.getElementById("loader").style.display = "none";
    }

    static showSpinner(): void {
        document.getElementById("loader").style.display = "block";
    }

    static port = 8080;
    static server = StaticHelpers.getQueryVariable("server") === "" ? "florentpastor.ddns.net" : StaticHelpers.getQueryVariable("server");


    static eval(input: string): void {
        const args = input.trim().split(" ").filter(f => f !== "");
        if (args.length === 0) {
            (window as any).app.commands.push({
                input: input,
                output: "Command does not exists.",
                templateName: "default"
            });
        } else {
            const commandName = args[0].toLowerCase();
            let commandFound = StaticHelpers.COMMANDS.find(f => f.getCommandName() === commandName);
            if (typeof commandFound === "undefined") {
                (window as any).app.commands.push({
                    input: input,
                    output: "Command does not exists.",
                    templateName: "default-component"
                });
            } else {
                this.showSpinner();
                commandFound.execute(input, args);
            }
        }
    }

    static autoComplete(): void {
        const propEngine = [
            {
                "name": "",
                "function": "getCommands"
            },
            {
                "name": "block",
                "function": "getBlocks"
            },
            {
                "name": "monster",
                "function": "getMonsters"
            },
            {
                "name": "new",
                "function": "getBlocks"
            }
        ];
        //console.log((window as any).app.currentInputValue);
        const pointer = (window as any).app.currentInputValue.trim().split(" ")[0];
        let toExecute = propEngine.find(f => f.name === pointer);
        if (toExecute === undefined) {
            console.log("no proposals");
            window.scrollTo(0, document.body.scrollHeight);
            //app.currentInputValue = "block";
            //autoComplete();
            return;
        }
        if ((window as any).app.proposalsIndex === -1) {
            StaticHelpers.showSpinner();
            window[toExecute.function]();
        }
        if ((window as any).app.proposals.length > 0) {
            (window as any).app.proposalsIndex = ((window as any).app.proposalsIndex + 1) % (window as any).app.proposals.length;
        } else {
            (window as any).app.proposalsIndex = -1;
        }
        window.scrollTo(0, document.body.scrollHeight);
    }

    static getQueryVariable(variable: string): string {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return "";
    }

    static getBlocks() {
        (async function () {
            let response = await $.ajax({
                contentType: "application/json",
                url: `http://${StaticHelpers.server}:${StaticHelpers.port}/api/blocks/`
            });
            (window as any).app.proposals = response.entity;
            (window as any).app.proposalsIndex = ((window as any).app.proposalsIndex + 1) % (window as any).app.proposals.length;
            StaticHelpers.hideSpinner();
        })();
    }

    static getMonsters() {
        (async function () {
            let response = await $.ajax({
                contentType: "application/json",
                url: `http://${StaticHelpers.server}:${StaticHelpers.port}/api/data/names`
            });
            (window as any).app.proposals = response.entity;
            (window as any).app.proposalsIndex = ((window as any).app.proposalsIndex + 1) % (window as any).app.proposals.length;
            StaticHelpers.hideSpinner();
        })();
    }

    static COMMANDS = [
        new ClearCommand(),
        new HelpCommand(),
        new BlockCommand(),
        new NewCommand(),
        new GetMonsterCommand(),
        new GetEncounterDataCommand(),
        new GetPlayingMonsterCommand(),
        new RollInitiativeCommand(),
        new DamageCommand(),
        new HealCommand(),
        new NextTurnCommand(),
        new ResetCommand(),
        new GetTurnCommand(),
        new RemoveCommand(),
        new SetInitiativeCommand(),
        new GetBlocksCommand()
    ];
}