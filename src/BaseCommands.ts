import Command from './Command.js';
import Konsole from './Konsole.js';

function command(
	alias: string[] | undefined,
	description: string | undefined,
	run: (this: Konsole, alias?: string, args?: string[]) => Promise<any> | any
): Command {
	return new Command(alias, description, run);
}

let baseCommands: Command[] = [
	command(['echo'], 'Repeats anything after the command', async function (_alias, args) {
		if (!args) {
			return '';
		}
		return args!.join(' ');
	}),
	command(['clear'], 'Clears the terminal', async function () {
		this.buffer = [this.options.prefix!];
	}),
	command(['help', '?'], 'Displays all commands', async function () {
		let output = `help for Konsole {version}\n  commands:\n`;
		for (const cmd of this.commands) {
			output += `   ${cmd.alias.join(' or ')} : ${cmd.description || ''}\n`;
		}
		return output;
	}),
	command(['wait'], 'Delays for the amount of seconds specified', async (_alias, args) => {
		if (!args) {
			return await new Promise((resolve) => setTimeout(resolve, 1));
		}
		return await new Promise((resolve) => setTimeout(resolve, Number(args[0]) * 1000));
	}),
	command(['version'], 'Displays version information', async function () {
		return `Konsole Version: {version}
Konsole Branch: {branch}
Developers: NicholacsC, BoxyPlayz`;
	}),
	command(['popup'], 'Shows a popup', async function (_alias, args) {
		if (!args) {
			return '';
		}
		alert(args.join(' '));
		return;
	}),
	command(['imwithyouinthedark'], 'error.', async function () {
		return "Don't forget. I'm with you in the dark.";
	}),
];

export async function registerBuiltins(register: (cmd: Command) => void) {
	register(new (await import('./HTTP.js')).default());
	register(new (await import('./LoadModule.js')).default());
}


export default baseCommands;
