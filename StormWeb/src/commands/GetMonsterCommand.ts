import Command from "./Command";
import {StaticHelpers} from "../StaticHelpers";
import * as $ from "jquery";
import {IHistoryCommand} from "../Application";
import {HistoryCommand} from "../poco/HistoryCommand";

export class GetMonsterCommand extends Command {
    constructor() {
        super("monster")
    }

    async execute(args: string[]): Promise<IHistoryCommand> {
        if (args.length < 1) {
            return new HistoryCommand(this.getCommandName(), args, "missing parameter (e.g.: monster adrien)", "default-component");
        } else {
            const monsterName = args[0];
            try {
                const result = await $.ajax({
                    contentType: "application/json",
                    url: `http://${StaticHelpers.server}:${StaticHelpers.port}/api/monster/` + monsterName,
                });
                return new HistoryCommand(this.getCommandName(), args, result, "monster-component")
            } catch (e) {
                switch (e.status) {
                    case 404 : return new HistoryCommand(this.getCommandName(), args, monsterName + " is not in the encounter.", "default-component");
                    case 500 : return new HistoryCommand(this.getCommandName(), args, "Error 500, Something went wrong!", "default-component");
                    default: return null;
                }
            }
        }
    }
}