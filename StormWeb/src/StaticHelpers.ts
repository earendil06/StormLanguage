import {ClearCommand} from "./commands/ClearCommand";
import {BlockCommand} from "./commands/BlockCommand";
import {HelpCommand} from "./commands/HelpCommand";
import {NewCommand} from "./commands/NewCommand";
import {GetMonsterCommand} from "./commands/GetMonsterCommand";
import {GetEncounterDataCommand} from "./commands/GetEncounterDataCommand";
import {RollInitiativeCommand} from "./commands/RollInitiativeCommand";
import {DamageCommand} from "./commands/DamageCommand";
import {GetTurnCommand} from "./commands/GetTurnCommand";
import {ResetCommand} from "./commands/ResetCommand";
import {NextTurnCommand} from "./commands/NextTurnCommand";
import {HealCommand} from "./commands/HealCommand";
import {RemoveCommand} from "./commands/RemoveCommand";
import {SetInitiativeCommand} from "./commands/SetInitiativeCommand";
import {GetBlocksCommand} from "./commands/GetBlocksCommand";
import {GetPlayingMonsterCommand} from "./commands/GetPlayingMonsterCommand";
import {Application} from "./Application";
import * as $ from "jquery";
import {ExportEncounterCommand} from "./commands/ExportEncounterCommand";
import {LoadEncounterCommand} from "./commands/LoadEncounterCommand";
import {ICommand} from "./commands/ICommand";

export class StaticHelpers {
    static hideSpinner(): void {
        document.getElementById("loader-img").style.display = "none";
    }

    static showSpinner(): void {
        document.getElementById("loader-img").style.display = "block";
    }

    static scrollWindow(): void {
        let container = document.getElementById('commandsContainer');
        if (container != null) {
            container.scrollTop = container.scrollHeight;
        }
    }

    static port = 8080;
    static server = StaticHelpers.getQueryVariable("server") === "" ? "localhost" : StaticHelpers.getQueryVariable("server");


    static async eval(command: string, additionalArgs: string[]): Promise<any> {
        if (command === "") {
            StaticHelpers.application().commands.push({
                command: command,
                args: additionalArgs,
                output: "Command does not exists.",
                templateName: "default-component"
            });
        } else {
            let commandFound = StaticHelpers.COMMANDS.find(f => f.getCommandName() === command) as ICommand;
            if (typeof commandFound === "undefined") {
                StaticHelpers.application().commands.push({
                    command: command,
                    args: additionalArgs,
                    output: "Command does not exists.",
                    templateName: "default-component"
                });
            } else {
                StaticHelpers.showSpinner();
                const res = await commandFound.execute(additionalArgs);
                if (res != null) {
                    StaticHelpers.application().commands.push(res);
                }
                StaticHelpers.hideSpinner();
            }
        }
    }

    static getQueryVariable(variable: string): string {
        const query = (window as any).location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return "";
    }

    static getCommands(): string[] {
        return StaticHelpers.COMMANDS.map(c => c.getCommandName()).sort();
    }

    static async getBlocks() {
        return await $.ajax({
            contentType: "application/json",
            url: `http://${StaticHelpers.server}:${StaticHelpers.port}/api/blocks`
        });

    }

    static async getMonsters() {
        return await $.ajax({
            contentType: "application/json",
            url: `http://${StaticHelpers.server}:${StaticHelpers.port}/api/data/names`
        });

    }

    static application(): Application {
        return (window as any).app as Application;
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
        new GetBlocksCommand(),
        new ExportEncounterCommand(),
        new LoadEncounterCommand()
    ];
}