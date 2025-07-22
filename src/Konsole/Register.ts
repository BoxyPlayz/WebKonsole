import Konsole from "../Konsole.js";
import Command from "../Command";

export default async function Register(this: Konsole, command: Command) {
        if (this.commands.some(cmd => cmd.alias.some(alias => command.alias.includes(alias)))) {
            throw new Error("Command alias already exists");
        }
        this.commands.push(command);
}