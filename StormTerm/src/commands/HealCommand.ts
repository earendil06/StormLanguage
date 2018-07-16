import {Command} from "./Command";
import {StaticHelpers} from "./StaticHelpers";

export class HealCommand extends Command {
    constructor(){
        super("heal");
    }

    execute(inputText: string, args: string[]): void {
        if (args.length < 3) {
            (window as any).app.commands.push({input: inputText, output: "missing parameters (e.g.: heal adrien 2)", templateName: "default-component"});
            StaticHelpers.hideSpinner();
        } else {
            const monsterName = args[1];
            const monsterDamage = args[2];
            $.ajax({
                contentType: "application/json",
                method: 'PUT',
                url: `http://${StaticHelpers.server}:${StaticHelpers.port}/api/damage`,
                data: JSON.stringify({"name": monsterName, "damage": monsterDamage}),
                statusCode: {
                    200: function (data) {
                        (window as any).app.commands.push({input: inputText, output: data, templateName: "monster-component"});
                    },
                    400: function () {
                        StaticHelpers.application().commands.push({
                            input: inputText,
                            output: 'The request should be like "heal adrien 2".',
                            templateName: "default-component"
                        });
                    },
                    404: function () {
                        StaticHelpers.application().commands.push({
                            input: inputText,
                            output: monsterName + " does not exists in the encounter.",
                            templateName: "default-component"
                        });
                    },
                    500: function () {
                        StaticHelpers.application().commands.push({
                            input: inputText,
                            output: "Error 500, Something went wrong!",
                            templateName: "default-component"
                        });
                    }
                }
            });

        }
    }
}