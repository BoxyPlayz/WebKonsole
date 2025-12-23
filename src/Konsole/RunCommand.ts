import Konsole from '../Konsole.js';

export default async function RunCommand(this: Konsole, text: string) {
	this.buffer.push('');

	for (var line of text.split(';')) {
		if (!line.trim()) continue;

		line = line.trim();

		const replaced = await this.replaceVars(line);
		const args = replaced.split(' ');
		const alias = args.shift();

		let matched = false;
		for (const cmd of this.commands) {
			if (cmd.alias.includes(alias || '')) {
				const result = await cmd.run.call(this, alias, args);
				if (result) {
					this.buffer[this.buffer.length - 1] =
						await this.replaceVars(result);
					this.buffer.push('');
				}
				matched = true;
				break;
			}
		}

		if (!matched) {
			this.buffer[this.buffer.length - 1] = `Unknown command: ${alias}`;
			this.buffer.push('');
		}
	}

	this.buffer[this.buffer.length - 1] = this.options.prefix;
	this.update();
}
