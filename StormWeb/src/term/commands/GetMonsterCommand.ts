import Command from "./Command";
import {StaticHelpers} from "../../StaticHelpers";
import {IHistoryCommand} from "../../IHistoryCommand";
import {HistoryCommand} from "../../poco/HistoryCommand";

export class GetMonsterCommand extends Command {
    constructor() {
        super("monster")
    }

    async execute(args: string[]): Promise<IHistoryCommand> {
        if (args.length < 1) {
            return new HistoryCommand(this.getCommandName(), args, "missing parameter (e.g.: monster adrien)", "error");
        } else {
            const monsterName = args[0];
            try {
                let found = StaticHelpers.engine().getMonsterByName(monsterName);
                return new HistoryCommand(this.getCommandName(), args, found, "monster")
            } catch (e) {
                return new HistoryCommand(this.getCommandName(), args, monsterName + " is not in the encounter.", "error");
            }
        }
    }
}